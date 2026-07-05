<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\DTOs\CartItemData;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CartServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_items_skips_corrupted_session_entries_without_error(): void
    {
        $product = Product::factory()->create([
            'sizes' => [42],
            'stock' => 5,
        ]);

        session()->put('cart', [
            CartItemData::fromProduct($product, 42, 2)->toArray(),
            [],
            'corrupted',
        ]);

        $items = app(CartService::class)->items();

        $this->assertCount(1, $items);
        $this->assertSame($product->id, $items[0]->productId);
        $this->assertSame(42, $items[0]->size);
        $this->assertSame(2, $items[0]->quantity);
    }

    public function test_items_clears_non_array_session_payload(): void
    {
        session()->put('cart', 'corrupted');

        $items = app(CartService::class)->items();

        $this->assertSame([], $items);
        $this->assertNull(session('cart'));
    }
}
