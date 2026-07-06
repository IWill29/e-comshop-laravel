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

    public function test_search_finds_products_by_name_brand_and_sku(): void
    {
        $byName = Product::factory()->create(['name' => 'Air Zoom Pegasus', 'brand' => 'Nike']);
        $byBrand = Product::factory()->create(['name' => 'Classic Runner', 'brand' => 'Adidas']);
        $bySku = Product::factory()->create([
            'name' => 'Trail Max',
            'sku' => 'PX-TRAIL-99',
            'brand' => 'Puma',
        ]);
        Product::factory()->create(['name' => 'Unrelated Shoe', 'brand' => 'Reebok']);

        $this->get(route('shop.search', ['q' => 'Pegasus']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Shop/Search')
                ->where('filters.query', 'Pegasus')
                ->has('products.data', 1)
                ->where('products.data.0.id', $byName->id)
            );

        $this->get(route('shop.search', ['q' => 'Adidas']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Shop/Search')
                ->has('products.data', 1)
                ->where('products.data.0.id', $byBrand->id)
            );

        $this->get(route('shop.search', ['q' => 'PX-TRAIL']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Shop/Search')
                ->has('products.data', 1)
                ->where('products.data.0.id', $bySku->id)
            );
    }

    public function test_sale_page_shows_only_discounted_products(): void
    {
        $onSale = Product::factory()->onSale()->create();
        Product::factory()->create([
            'price' => 12000,
            'compare_at_price' => null,
        ]);

        $this->get(route('shop.sale'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Shop/Sale')
                ->has('products.data', 1)
                ->where('products.data.0.id', $onSale->id)
            );
    }

    public function test_new_arrivals_page_shows_only_recent_products_sorted_by_newest(): void
    {
        $older = Product::factory()->create([
            'name' => 'Older Drop',
            'created_at' => now()->subDays(3),
        ]);
        $newer = Product::factory()->create([
            'name' => 'Latest Drop',
            'created_at' => now(),
        ]);
        Product::factory()->create([
            'name' => 'Archived Drop',
            'created_at' => now()->subDays(Product::NEW_ARRIVAL_DAYS + 1),
        ]);

        $this->get(route('shop.new-arrivals'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Shop/NewArrivals')
                ->has('products.data', 2)
                ->where('products.data.0.id', $newer->id)
                ->where('products.data.1.id', $older->id)
            );
    }

    public function test_search_suggestions_returns_matching_products(): void
    {
        $match = Product::factory()->create(['name' => 'Air Max Pulse', 'brand' => 'Nike']);
        Product::factory()->create(['name' => 'Unrelated Shoe', 'brand' => 'Puma']);

        $this->getJson(route('shop.search.suggestions', ['q' => 'Air Max']))
            ->assertOk()
            ->assertJsonPath('query', 'Air Max')
            ->assertJsonCount(1, 'suggestions')
            ->assertJsonPath('suggestions.0.id', $match->id);

        $this->getJson(route('shop.search.suggestions', ['q' => 'a']))
            ->assertOk()
            ->assertJsonCount(0, 'suggestions');
    }

    public function test_search_is_case_insensitive(): void
    {
        $product = Product::factory()->create(['name' => 'Classic Runner', 'brand' => 'Adidas']);

        $this->getJson(route('shop.search.suggestions', ['q' => 'adidas']))
            ->assertOk()
            ->assertJsonCount(1, 'suggestions')
            ->assertJsonPath('suggestions.0.id', $product->id);

        $this->get(route('shop.search', ['q' => 'classic']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Shop/Search')
                ->has('products.data', 1)
                ->where('products.data.0.id', $product->id)
            );
    }
}
