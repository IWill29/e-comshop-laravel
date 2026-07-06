<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Actions\CreateCheckoutSessionAction;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Support\Header;
use Tests\TestCase;

class CheckoutTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_rejects_empty_cart(): void
    {
        $this->from(route('checkout.index'))
            ->post(route('checkout.store'), $this->validCheckoutPayload())
            ->assertRedirect(route('checkout.index'))
            ->assertSessionHasErrors('cart');
    }

    public function test_store_redirects_to_stripe_when_cart_has_items(): void
    {
        $product = Product::factory()->create([
            'sizes' => [42],
            'stock' => 5,
        ]);

        $cart = app(CartService::class);
        $cart->add($product, 42, 1);

        $this->mock(CreateCheckoutSessionAction::class, function ($mock): void {
            $mock->shouldReceive('handle')
                ->once()
                ->andReturn('https://checkout.stripe.com/test-session');
        });

        $this->from(route('checkout.index'))
            ->post(route('checkout.store'), $this->validCheckoutPayload())
            ->assertRedirect('https://checkout.stripe.com/test-session');
    }

    public function test_store_returns_inertia_location_header_for_external_stripe_redirect(): void
    {
        $product = Product::factory()->create([
            'sizes' => [42],
            'stock' => 5,
        ]);

        app(CartService::class)->add($product, 42, 1);

        $this->mock(CreateCheckoutSessionAction::class, function ($mock): void {
            $mock->shouldReceive('handle')
                ->once()
                ->andReturn('https://checkout.stripe.com/test-session');
        });

        $this->from(route('checkout.index'))
            ->withHeaders([
                Header::INERTIA => 'true',
            ])
            ->post(route('checkout.store'), $this->validCheckoutPayload())
            ->assertStatus(409)
            ->assertHeader(Header::LOCATION, 'https://checkout.stripe.com/test-session');
    }

    public function test_store_validates_checkout_fields(): void
    {
        $product = Product::factory()->create([
            'sizes' => [42],
            'stock' => 5,
        ]);

        app(CartService::class)->add($product, 42, 1);

        $this->from(route('checkout.index'))
            ->post(route('checkout.store'), [])
            ->assertSessionHasErrors(['email', 'name', 'line1', 'city', 'state', 'postalCode', 'country']);
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
