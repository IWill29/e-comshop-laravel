<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;
use Tests\TestCase;

class StripeWebhookTest extends TestCase
{
    use RefreshDatabase;

    private const WEBHOOK_SECRET = 'whsec_test_secret_for_phpunit';

    protected function setUp(): void
    {
        parent::setUp();

        config(['services.stripe.webhook_secret' => self::WEBHOOK_SECRET]);
    }

    public function test_checkout_session_completed_marks_order_paid(): void
    {
        $order = Order::factory()->guest()->create([
            'status' => OrderStatus::Pending,
            'payment_status' => PaymentStatus::Pending,
            'stripe_session_id' => 'cs_test_completed',
        ]);

        $response = $this->postStripeWebhook('checkout.session.completed', [
            'id' => 'cs_test_completed',
            'payment_status' => 'paid',
            'metadata' => [
                'order_id' => (string) $order->id,
            ],
        ]);

        $response->assertOk()->assertJson(['received' => true]);

        $order->refresh();

        $this->assertSame(OrderStatus::Paid, $order->status);
        $this->assertSame(PaymentStatus::Paid, $order->payment_status);
    }

    public function test_checkout_session_expired_restores_stock_and_cancels_order(): void
    {
        $product = Product::factory()->create([
            'stock' => 3,
        ]);

        $order = Order::factory()->guest()->create([
            'status' => OrderStatus::Pending,
            'payment_status' => PaymentStatus::Pending,
            'stripe_session_id' => 'cs_test_expired',
        ]);

        OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        $response = $this->postStripeWebhook('checkout.session.expired', [
            'id' => 'cs_test_expired',
            'payment_status' => 'unpaid',
            'metadata' => [
                'order_id' => (string) $order->id,
            ],
        ]);

        $response->assertOk()->assertJson(['received' => true]);

        $order->refresh();

        $this->assertSame(OrderStatus::Cancelled, $order->status);
        $this->assertSame(PaymentStatus::Failed, $order->payment_status);
        $this->assertSame(5, $product->fresh()->stock);
    }

    public function test_webhook_rejects_invalid_signature(): void
    {
        $payload = json_encode([
            'id' => 'evt_test',
            'type' => 'checkout.session.completed',
            'data' => [
                'object' => [
                    'id' => 'cs_test',
                    'payment_status' => 'paid',
                    'metadata' => [],
                ],
            ],
        ], JSON_THROW_ON_ERROR);

        $response = $this->call(
            'POST',
            route('stripe.webhook'),
            [],
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_Stripe-Signature' => 't=123,v1=invalid',
            ],
            $payload,
        );

        $response->assertStatus(400);
    }

    public function test_completed_webhook_is_idempotent_for_paid_orders(): void
    {
        $order = Order::factory()->guest()->paid()->create([
            'stripe_session_id' => 'cs_test_already_paid',
        ]);

        $response = $this->postStripeWebhook('checkout.session.completed', [
            'id' => 'cs_test_already_paid',
            'payment_status' => 'paid',
            'metadata' => [
                'order_id' => (string) $order->id,
            ],
        ]);

        $response->assertOk();

        $order->refresh();

        $this->assertSame(OrderStatus::Paid, $order->status);
        $this->assertSame(PaymentStatus::Paid, $order->payment_status);
    }

    /**
     * @param  array<string, mixed>  $session
     */
    private function postStripeWebhook(string $type, array $session): TestResponse
    {
        $payload = json_encode([
            'id' => 'evt_test_'.md5($type.serialize($session)),
            'object' => 'event',
            'type' => $type,
            'data' => [
                'object' => array_merge([
                    'object' => 'checkout.session',
                ], $session),
            ],
        ], JSON_THROW_ON_ERROR);

        $signature = $this->signPayload($payload);

        return $this->call(
            'POST',
            route('stripe.webhook'),
            [],
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_Stripe-Signature' => $signature,
            ],
            $payload,
        );
    }

    private function signPayload(string $payload, ?int $timestamp = null): string
    {
        $timestamp ??= time();
        $signedPayload = "{$timestamp}.{$payload}";
        $signature = hash_hmac('sha256', $signedPayload, self::WEBHOOK_SECRET);

        return "t={$timestamp},v1={$signature}";
    }
}
