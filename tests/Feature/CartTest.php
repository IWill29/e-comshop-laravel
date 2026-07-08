<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Product;
use App\Services\CartService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CartTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_add_product_to_cart(): void
    {
        $product = Product::factory()->create([
            'sizes' => [42, 43],
            'stock' => 5,
        ]);

        $response = $this->from(route('products.show', $product))
            ->post(route('cart.store', $product), [
                'size' => 42,
                'quantity' => 1,
            ]);

        $response->assertRedirect(route('products.show', $product));

        $cart = app(CartService::class);
        $this->assertSame(1, $cart->count());
        $this->assertSame(42, $cart->items()[0]->size);
    }

    public function test_cart_index_shows_session_items(): void
    {
        $product = Product::factory()->create([
            'sizes' => [42],
            'stock' => 3,
            'color' => 'Black',
        ]);

        app(CartService::class)->add($product, 42, 2);

        $this->get(route('cart.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Cart/Index')
                ->has('items', 1)
                ->where('items.0.key', "{$product->id}-42")
                ->where('items.0.color', 'Black')
                ->where('items.0.quantity', 2)
                ->where('items.0.maxQuantity', 3)
                ->where('itemCount', 2)
            );
    }

    public function test_cart_item_quantity_can_be_updated(): void
    {
        $product = Product::factory()->create([
            'sizes' => [42],
            'stock' => 5,
        ]);

        app(CartService::class)->add($product, 42, 1);
        $key = "{$product->id}-42";

        $this->patch(route('cart.items.update', $key), [
            'quantity' => 3,
        ])->assertRedirect();

        $this->assertSame(3, app(CartService::class)->items()[0]->quantity);
    }

    public function test_cart_item_can_be_removed(): void
    {
        $product = Product::factory()->create([
            'sizes' => [42],
            'stock' => 5,
        ]);

        app(CartService::class)->add($product, 42, 1);
        $key = "{$product->id}-42";

        $this->delete(route('cart.items.destroy', $key))
            ->assertRedirect();

        $this->assertTrue(app(CartService::class)->isEmpty());
    }

    public function test_add_to_cart_validates_size(): void
    {
        $product = Product::factory()->create([
            'sizes' => [42],
            'stock' => 5,
        ]);

        $this->from(route('products.show', $product))
            ->post(route('cart.store', $product), [
                'size' => 99,
            ])
            ->assertRedirect(route('products.show', $product))
            ->assertSessionHasErrors('size');
    }

    public function test_shared_cart_count_reflects_session_items(): void
    {
        $product = Product::factory()->create([
            'sizes' => [42],
            'stock' => 5,
        ]);

        app(CartService::class)->add($product, 42, 2);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->where('cartCount', 2));
    }
}
