<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ShopTest extends TestCase
{
    use RefreshDatabase;

    public function test_shop_index_succeeds_when_no_active_products(): void
    {
        Product::factory()->inactive()->create();

        $this->get(route('shop.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Shop/Index')
                ->where('filterOptions.priceRange.min', 0)
                ->where('filterOptions.priceRange.max', 0)
                ->where('products.meta.total', 0)
            );
    }

    public function test_shop_index_sorts_by_price_ascending(): void
    {
        $expensive = Product::factory()->create(['price' => 20000, 'name' => 'Expensive Shoe']);
        $cheap = Product::factory()->create(['price' => 5000, 'name' => 'Cheap Shoe']);

        $this->get(route('shop.index', ['sort' => 'price_asc']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Shop/Index')
                ->has('products.data', 2)
                ->where('products.data.0.id', $cheap->id)
                ->where('products.data.1.id', $expensive->id)
            );
    }

    public function test_shop_index_sorts_by_newest(): void
    {
        $older = Product::factory()->create([
            'name' => 'Older Shoe',
            'created_at' => now()->subDay(),
        ]);
        $newer = Product::factory()->create([
            'name' => 'Newer Shoe',
            'created_at' => now(),
        ]);

        $this->get(route('shop.index', ['sort' => 'newest']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Shop/Index')
                ->has('products.data', 2)
                ->where('products.data.0.id', $newer->id)
                ->where('products.data.1.id', $older->id)
            );
    }

    public function test_shop_filter_options_returns_unique_brands(): void
    {
        Product::factory()->create(['brand' => 'Nike']);
        Product::factory()->create(['brand' => 'Nike']);
        Product::factory()->create(['brand' => 'Adidas']);

        $this->get(route('shop.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Shop/Index')
                ->where('filterOptions.brands', ['Adidas', 'Nike'])
            );
    }
}
