<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Product;
use App\Services\CartService;

class AddToCartAction
{
    public function __construct(
        private CartService $cart,
    ) {}

    public function handle(Product $product, int $size, int $quantity = 1): void
    {
        $this->cart->add($product, $size, $quantity);
    }
}
