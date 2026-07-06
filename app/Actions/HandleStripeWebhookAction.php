<?php

declare(strict_types=1);

namespace App\Actions;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use Stripe\Checkout\Session;
use Stripe\Event;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;
use UnexpectedValueException;

class HandleStripeWebhookAction
{
    /**
     * @throws SignatureVerificationException
     * @throws UnexpectedValueException
     */
    public function handle(string $payload, string $signatureHeader): void
    {
        $secret = config('services.stripe.webhook_secret');

        if (! is_string($secret) || $secret === '') {
            throw new RuntimeException('Stripe webhook secret is not configured. Set STRIPE_WEBHOOK_SECRET.');
        }

        $event = Webhook::constructEvent($payload, $signatureHeader, $secret);

        match ($event->type) {
            'checkout.session.completed' => $this->handleCheckoutSessionCompleted($event),
            'checkout.session.expired' => $this->handleCheckoutSessionExpired($event),
            default => null,
        };
    }

    private function handleCheckoutSessionCompleted(Event $event): void
    {
        $session = $this->sessionFromEvent($event);

        if ($session->payment_status !== 'paid') {
            return;
        }

        $order = $this->findOrder($session);

        if ($order === null || $order->payment_status === PaymentStatus::Paid) {
            return;
        }

        $order->update([
            'status' => OrderStatus::Paid,
            'payment_status' => PaymentStatus::Paid,
            'stripe_session_id' => $session->id,
        ]);
    }

    private function handleCheckoutSessionExpired(Event $event): void
    {
        $session = $this->sessionFromEvent($event);
        $order = $this->findOrder($session);

        if ($order === null || $order->payment_status !== PaymentStatus::Pending) {
            return;
        }

        DB::transaction(function () use ($order): void {
            $order->refresh();

            if ($order->payment_status !== PaymentStatus::Pending) {
                return;
            }

            $this->restoreStock($order);
            $order->update([
                'status' => OrderStatus::Cancelled,
                'payment_status' => PaymentStatus::Failed,
            ]);
        });
    }

    private function sessionFromEvent(Event $event): Session
    {
        /** @var Session $session */
        $session = $event->data->object;

        return $session;
    }

    private function findOrder(Session $session): ?Order
    {
        $metadata = $session->metadata ?? null;
        $orderId = is_object($metadata) && isset($metadata->order_id)
            ? $metadata->order_id
            : (is_array($metadata) ? ($metadata['order_id'] ?? null) : null);

        if (is_string($orderId) && $orderId !== '') {
            $order = Order::query()->find((int) $orderId);

            if ($order !== null) {
                return $order;
            }
        }

        if (! is_string($session->id) || $session->id === '') {
            return null;
        }

        return Order::query()
            ->where('stripe_session_id', $session->id)
            ->first();
    }

    private function restoreStock(Order $order): void
    {
        $order->load('items');

        $productIds = $order->items
            ->pluck('product_id')
            ->unique()
            ->sort()
            ->values()
            ->all();

        if ($productIds === []) {
            return;
        }

        /** @var EloquentCollection<int, Product> $products */
        $products = Product::query()
            ->whereIn('id', $productIds)
            ->lockForUpdate()
            ->get()
            ->keyBy('id');

        foreach ($order->items as $item) {
            $product = $products->get($item->product_id);

            if ($product === null) {
                continue;
            }

            $product->increment('stock', $item->quantity);
        }
    }
}
