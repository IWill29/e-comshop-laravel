<?php

declare(strict_types=1);

namespace App\Actions;

use App\DTOs\CartItemData;
use App\DTOs\CheckoutData;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Enums\ProductImageSize;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Services\CartService;
use App\Services\ProductImageService;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use RuntimeException;
use Stripe\Checkout\Session;
use Stripe\Stripe;
use Throwable;

class CreateCheckoutSessionAction
{
    public function __construct(
        private CartService $cart,
        private ProductImageService $images,
    ) {}

    public function handle(CheckoutData $checkout, ?User $user): string
    {
        $items = $this->cart->items();

        if ($items === []) {
            throw ValidationException::withMessages([
                'cart' => 'Your cart is empty. Add items before checking out.',
            ]);
        }

        $secret = config('services.stripe.secret');

        if (! is_string($secret) || $secret === '') {
            throw new RuntimeException('Stripe is not configured. Set STRIPE_SECRET in your environment.');
        }

        $order = $this->createPendingOrder($checkout, $user, $items);

        try {
            Stripe::setApiKey($secret);

            $session = $this->createStripeCheckoutSession($checkout, $order, $this->buildLineItems($items));

            if (! is_string($session->url) || $session->url === '') {
                throw new RuntimeException('Stripe did not return a checkout URL.');
            }

            $order->update([
                'stripe_session_id' => $session->id,
            ]);

            $this->cart->clear();

            return $session->url;
        } catch (Throwable $exception) {
            $this->releasePendingOrder($order, $items);

            throw $exception;
        }
    }

    /**
     * @param  list<CartItemData>  $items
     */
    private function createPendingOrder(CheckoutData $checkout, ?User $user, array $items): Order
    {
        return DB::transaction(function () use ($checkout, $user, $items): Order {
            $products = $this->lockProducts($items);
            $this->assertStockAvailable($items, $products);
            $this->adjustStock($items, $products, decrement: true);

            $order = Order::query()->create([
                'user_id' => $user?->id,
                'email' => $checkout->email,
                'status' => OrderStatus::Pending,
                'payment_status' => PaymentStatus::Pending,
                'total' => $this->orderTotal($items),
                'currency' => 'usd',
            ]);

            foreach ($items as $item) {
                $order->items()->create([
                    'product_id' => $item->productId,
                    'product_name' => $item->name,
                    'size' => $item->size,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unitPrice,
                ]);
            }

            return $order;
        });
    }

    /**
     * @param  list<CartItemData>  $items
     */
    private function releasePendingOrder(Order $order, array $items): void
    {
        DB::transaction(function () use ($order, $items): void {
            if ($order->trashed()) {
                return;
            }

            $products = $this->lockProducts($items);
            $this->adjustStock($items, $products, decrement: false);
            $order->delete();
        });
    }

    /**
     * @param  list<CartItemData>  $items
     * @return EloquentCollection<int, Product>
     */
    private function lockProducts(array $items): EloquentCollection
    {
        $productIds = array_values(array_unique(array_map(
            fn (CartItemData $item): int => $item->productId,
            $items,
        )));

        sort($productIds);

        return Product::query()
            ->whereIn('id', $productIds)
            ->lockForUpdate()
            ->get()
            ->keyBy('id');
    }

    /**
     * @param  list<CartItemData>  $items
     * @param  EloquentCollection<int, Product>  $products
     */
    private function assertStockAvailable(array $items, EloquentCollection $products): void
    {
        foreach ($items as $item) {
            $product = $products->get($item->productId);

            if ($product === null || ! $product->is_active) {
                throw ValidationException::withMessages([
                    'cart' => 'A product in your cart is no longer available.',
                ]);
            }

            if (! $product->supportsSize($item->size)) {
                throw ValidationException::withMessages([
                    'cart' => 'A selected size in your cart is no longer available.',
                ]);
            }
        }

        foreach ($this->quantitiesByProduct($items) as $productId => $quantity) {
            $product = $products->get($productId);

            if ($product === null || $product->stock < $quantity) {
                throw ValidationException::withMessages([
                    'cart' => 'Not enough stock for one or more items in your cart.',
                ]);
            }
        }
    }

    /**
     * @param  list<CartItemData>  $items
     * @param  EloquentCollection<int, Product>  $products
     */
    private function adjustStock(array $items, EloquentCollection $products, bool $decrement): void
    {
        foreach ($this->quantitiesByProduct($items) as $productId => $quantity) {
            $product = $products->get($productId);

            if ($product === null) {
                continue;
            }

            if ($decrement) {
                $product->decrement('stock', $quantity);
            } else {
                $product->increment('stock', $quantity);
            }
        }
    }

    /**
     * @param  list<CartItemData>  $items
     * @return array<int, int>
     */
    private function quantitiesByProduct(array $items): array
    {
        $quantities = [];

        foreach ($items as $item) {
            $quantities[$item->productId] = ($quantities[$item->productId] ?? 0) + $item->quantity;
        }

        return $quantities;
    }

    /**
     * @param  list<CartItemData>  $items
     */
    private function orderTotal(array $items): int
    {
        return array_sum(array_map(
            fn (CartItemData $item): int => $item->lineTotal(),
            $items,
        )) + $this->cart->shipping();
    }

    /**
     * @param  list<array<string, mixed>>  $lineItems
     */
    protected function createStripeCheckoutSession(
        CheckoutData $checkout,
        Order $order,
        array $lineItems,
    ): Session {
        return Session::create([
            'mode' => 'payment',
            'customer_email' => $checkout->email,
            'line_items' => $lineItems,
            'success_url' => route('checkout.success').'?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('checkout.cancel'),
            'metadata' => $checkout->toStripeMetadata($order->id),
            'branding_settings' => $this->checkoutBrandingSettings(),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function checkoutBrandingSettings(): array
    {
        /** @var array<string, string|null> $branding */
        $branding = config('services.stripe.branding', []);

        $settings = [
            'display_name' => $branding['display_name'] ?? 'ParaditX',
            'background_color' => $branding['background_color'] ?? '#FAFAF9',
            'button_color' => $branding['button_color'] ?? '#4F46E5',
            'border_style' => $branding['border_style'] ?? 'rounded',
            'font_family' => $branding['font_family'] ?? 'inter',
        ];

        $iconFile = $branding['icon_file'] ?? null;

        if (is_string($iconFile) && $iconFile !== '') {
            $settings['icon'] = [
                'type' => 'file',
                'file' => $iconFile,
            ];
        }

        $logoFile = $branding['logo_file'] ?? null;

        if (is_string($logoFile) && $logoFile !== '') {
            $settings['logo'] = [
                'type' => 'file',
                'file' => $logoFile,
            ];
        }

        return $settings;
    }

    /**
     * @param  list<CartItemData>  $items
     * @return list<array<string, mixed>>
     */
    private function buildLineItems(array $items): array
    {
        $lineItems = [];

        foreach ($items as $item) {
            $productData = [
                'name' => $item->name,
                'description' => "{$item->brand} · Size {$item->size}",
            ];

            if ($item->imageUrl !== '') {
                $productData['images'] = [
                    $this->images->url($item->imageUrl, ProductImageSize::Card),
                ];
            }

            $lineItems[] = [
                'price_data' => [
                    'currency' => 'usd',
                    'product_data' => $productData,
                    'unit_amount' => $item->unitPrice,
                ],
                'quantity' => $item->quantity,
            ];
        }

        if ($this->cart->shipping() > 0) {
            $lineItems[] = [
                'price_data' => [
                    'currency' => 'usd',
                    'product_data' => [
                        'name' => 'Shipping',
                    ],
                    'unit_amount' => $this->cart->shipping(),
                ],
                'quantity' => 1,
            ];
        }

        return $lineItems;
    }
}
