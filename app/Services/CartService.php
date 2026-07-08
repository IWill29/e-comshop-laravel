<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\CartItemData;
use App\Enums\ProductImageSize;
use App\Models\Product;
use App\Services\ProductImageService;
use Illuminate\Contracts\Session\Session;
use Illuminate\Validation\ValidationException;

class CartService
{
    private const SESSION_KEY = 'cart';

    private const CURRENCY = 'usd';

    public function __construct(
        private Session $session,
        private ProductImageService $images,
    ) {}

    /**
     * @return list<CartItemData>
     */
    public function items(): array
    {
        $stored = $this->session->get(self::SESSION_KEY, []);

        if (! is_array($stored)) {
            $this->clear();

            return [];
        }

        $items = [];

        foreach ($stored as $item) {
            if (! is_array($item)) {
                continue;
            }

            $parsed = CartItemData::tryFromArray($item);

            if ($parsed !== null) {
                $items[] = $parsed;
            }
        }

        if (count($items) !== count($stored)) {
            $this->persist($items);
        }

        return $items;
    }

    public function isEmpty(): bool
    {
        return $this->items() === [];
    }

    public function count(): int
    {
        return array_sum(array_map(
            fn (CartItemData $item): int => $item->quantity,
            $this->items(),
        ));
    }

    public function add(Product $product, int $size, int $quantity = 1): void
    {
        if (! $product->is_active) {
            throw ValidationException::withMessages([
                'size' => 'This product is no longer available.',
            ]);
        }

        if ($quantity < 1) {
            throw ValidationException::withMessages([
                'quantity' => 'Quantity must be at least 1.',
            ]);
        }

        if (! $product->supportsSize($size)) {
            throw ValidationException::withMessages([
                'size' => 'Selected size is not available for this product.',
            ]);
        }

        if ($product->stock < $quantity) {
            throw ValidationException::withMessages([
                'quantity' => 'Not enough stock for the selected quantity.',
            ]);
        }

        $items = $this->items();
        $key = "{$product->id}-{$size}";
        $indexed = [];

        foreach ($items as $item) {
            $indexed[$item->key()] = $item;
        }

        $existing = $indexed[$key] ?? null;
        $newQuantity = ($existing !== null ? $existing->quantity : 0) + $quantity;

        if ($product->stock < $newQuantity) {
            throw ValidationException::withMessages([
                'quantity' => 'Not enough stock for the selected quantity.',
            ]);
        }

        $indexed[$key] = CartItemData::fromProduct($product, $size, $newQuantity);
        $this->persist(array_values($indexed));
    }

    public function subtotal(): int
    {
        return array_sum(array_map(
            fn (CartItemData $item): int => $item->lineTotal(),
            $this->items(),
        ));
    }

    public function shipping(): int
    {
        return 0;
    }

    public function total(): int
    {
        return $this->subtotal() + $this->shipping();
    }

    /**
     * @return array{subtotal: int, shipping: int, total: int, currency: string}
     */
    public function summary(): array
    {
        return [
            'subtotal' => $this->subtotal(),
            'shipping' => $this->shipping(),
            'total' => $this->total(),
            'currency' => self::CURRENCY,
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    public function toFrontendItems(): array
    {
        return array_map(
            fn (CartItemData $item): array => [
                ...$item->toFrontendArray(),
                'imageUrl' => $this->images->url($item->imageUrl, ProductImageSize::Cart),
            ],
            $this->items(),
        );
    }

    /**
     * @return list<array<string, mixed>>
     */
    public function toCartPageItems(): array
    {
        $items = $this->items();

        if ($items === []) {
            return [];
        }

        $products = Product::query()
            ->whereIn('id', array_unique(array_map(
                fn (CartItemData $item): int => $item->productId,
                $items,
            )))
            ->where('is_active', true)
            ->get()
            ->keyBy('id');

        $pageItems = [];
        $synced = [];

        foreach ($items as $item) {
            $product = $products->get($item->productId);

            if ($product === null) {
                continue;
            }

            if (! $product->supportsSize($item->size)) {
                continue;
            }

            if ($product->stock < 1) {
                continue;
            }

            $quantity = min($item->quantity, $product->stock);
            $syncedItem = CartItemData::fromProduct($product, $item->size, $quantity);
            $synced[] = $syncedItem;

            $pageItems[] = [
                'key' => $syncedItem->key(),
                'productId' => $syncedItem->productId,
                'name' => $syncedItem->name,
                'slug' => $syncedItem->slug,
                'brand' => $syncedItem->brand,
                'color' => $product->color,
                'imageUrl' => $this->images->url($syncedItem->imageUrl, ProductImageSize::Cart),
                'size' => $syncedItem->size,
                'quantity' => $syncedItem->quantity,
                'unitPrice' => $syncedItem->unitPrice,
                'lineTotal' => $syncedItem->lineTotal(),
                'maxQuantity' => $product->stock,
            ];
        }

        if (! $this->itemsMatch($items, $synced)) {
            $this->persist($synced);
        }

        return $pageItems;
    }

    public function updateQuantity(string $key, int $quantity): void
    {
        if ($quantity < 1) {
            throw ValidationException::withMessages([
                'quantity' => 'Quantity must be at least 1.',
            ]);
        }

        $item = $this->findItem($key);

        if ($item === null) {
            throw ValidationException::withMessages([
                'cart' => 'That cart item is no longer available.',
            ]);
        }

        $product = Product::query()
            ->where('id', $item->productId)
            ->where('is_active', true)
            ->first();

        if ($product === null) {
            $this->remove($key);

            throw ValidationException::withMessages([
                'cart' => 'A product in your cart is no longer available.',
            ]);
        }

        if (! $product->supportsSize($item->size)) {
            $this->remove($key);

            throw ValidationException::withMessages([
                'cart' => 'A selected size in your cart is no longer available.',
            ]);
        }

        if ($product->stock < $quantity) {
            throw ValidationException::withMessages([
                'quantity' => 'Not enough stock for the selected quantity.',
            ]);
        }

        $items = $this->items();
        $indexed = [];

        foreach ($items as $cartItem) {
            $indexed[$cartItem->key()] = $cartItem;
        }

        $indexed[$key] = CartItemData::fromProduct($product, $item->size, $quantity);
        $this->persist(array_values($indexed));
    }

    public function remove(string $key): void
    {
        $remaining = array_values(array_filter(
            $this->items(),
            fn (CartItemData $item): bool => $item->key() !== $key,
        ));

        $this->persist($remaining);
    }

    public function clear(): void
    {
        $this->session->forget(self::SESSION_KEY);
    }

    private function findItem(string $key): ?CartItemData
    {
        foreach ($this->items() as $item) {
            if ($item->key() === $key) {
                return $item;
            }
        }

        return null;
    }

    /**
     * @param  list<CartItemData>  $current
     * @param  list<CartItemData>  $synced
     */
    private function itemsMatch(array $current, array $synced): bool
    {
        if (count($current) !== count($synced)) {
            return false;
        }

        foreach ($current as $index => $item) {
            $other = $synced[$index] ?? null;

            if ($other === null) {
                return false;
            }

            if ($item->toArray() !== $other->toArray()) {
                return false;
            }
        }

        return true;
    }

    /**
     * @param  list<CartItemData>  $items
     */
    private function persist(array $items): void
    {
        $this->session->put(
            self::SESSION_KEY,
            array_map(fn (CartItemData $item): array => $item->toArray(), $items),
        );
    }
}
