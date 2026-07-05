<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $featuredProducts = Product::query()
            ->with('category')
            ->where('is_active', true)
            ->where('is_featured', true)
            ->limit(4)
            ->get();

        $newArrivals = Product::query()
            ->with('category')
            ->where('is_active', true)
            ->latest()
            ->limit(8)
            ->get();

        $categories = Category::query()
            ->withCount(['products' => fn ($query) => $query->where('is_active', true)])
            ->orderBy('name')
            ->get();

        return Inertia::render('Home', [
            'featuredProducts' => ProductResource::collection($featuredProducts),
            'newArrivals' => ProductResource::collection($newArrivals),
            'categories' => CategoryResource::collection($categories),
        ]);
    }
}
