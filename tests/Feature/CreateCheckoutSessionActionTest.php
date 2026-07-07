<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Actions\CreateCheckoutSessionAction;
use App\DTOs\CheckoutData;
use App\Models\Order;
use App\Models\Product;
use App\Services\CartService;
use App\Services\ProductImageService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use RuntimeException;
use Stripe\Checkout\Session;
use Tests\TestCase;

class CreateCheckoutSessionActionTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        Mockery::close();

        parent::tearDown();
    }

    public function test_handle_clears_cart_and_reserves_stock_after_stripe_session_is_created(): void
    {
        config(['services.stripe.secret' => 'sk_test_fake']);

        $product = Product::factory()->create([
            'sizes' => [42],
            'stock' => 5,
        ]);

        $cart = app(CartService::class);
        $cart->add($product, 42, 1);

        $session = Session::constructFrom([
            'id' => 'cs_test_session',
            'url' => 'https://checkout.stripe.com/c/pay/cs_test_session',
        ]);

        $action = Mockery::mock(CreateCheckoutSessionAction::class, [$cart, app(ProductImageService::class)])->makePartial();
        $action->shouldAllowMockingProtectedMethods();
        $action->shouldReceive('createStripeCheckoutSession')
            ->once()
            ->andReturn($session);

        $this->instance(CreateCheckoutSessionAction::class, $action);

        $url = $action->handle(
            CheckoutData::fromValidated($this->validCheckoutPayload()),
            null,
        );

        $this->assertSame('https://checkout.stripe.com/c/pay/cs_test_session', $url);
        $this->assertTrue($cart->isEmpty());
        $this->assertSame(4, $product->fresh()->stock);
        $this->assertSame(1, Order::query()->count());
    }

    public function test_handle_restores_stock_and_removes_order_when_stripe_fails(): void
    {
        config(['services.stripe.secret' => 'sk_test_fake']);

        $product = Product::factory()->create([
            'sizes' => [42],
            'stock' => 5,
        ]);

        $cart = app(CartService::class);
        $cart->add($product, 42, 2);

        $action = Mockery::mock(CreateCheckoutSessionAction::class, [$cart, app(ProductImageService::class)])->makePartial();
        $action->shouldAllowMockingProtectedMethods();
        $action->shouldReceive('createStripeCheckoutSession')
            ->once()
            ->andThrow(new RuntimeException('Stripe unavailable'));

        $this->instance(CreateCheckoutSessionAction::class, $action);

        try {
            $action->handle(
                CheckoutData::fromValidated($this->validCheckoutPayload()),
                null,
            );
            $this->fail('Expected checkout to fail when Stripe is unavailable.');
        } catch (RuntimeException $exception) {
            $this->assertSame('Stripe unavailable', $exception->getMessage());
        }

        $this->assertFalse($cart->isEmpty());
        $this->assertSame(5, $product->fresh()->stock);
        $this->assertSame(0, Order::query()->count());
    }

    /**
     * @return array<string, string>
     */
    private function validCheckoutPayload(): array
    {
        return [
            'email' => 'buyer@example.com',
            'name' => 'Jane Buyer',
            'line1' => '123 Main St',
            'line2' => '',
            'city' => 'Riga',
            'state' => 'Riga',
            'postalCode' => 'LV-1010',
            'country' => 'LV',
        ];
    }
}
