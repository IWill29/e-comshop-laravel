<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\ProductDetailResource;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function show(Product $product): Response
    {
        abort_unless($product->is_active, 404);

        $product->load('category');

        return Inertia::render('Shop/Show', [
            'product' => ProductDetailResource::make($product),
        ]);
    }
}
