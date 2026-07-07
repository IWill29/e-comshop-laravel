<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\ProductImageSize;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Services\ProductImageService;
use App\Services\ShopCacheService;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(ShopCacheService $cache, ProductImageService $images): Response
    {
        $featuredProducts = $cache->homeFeaturedProducts();
        $heroProduct = $featuredProducts->first();

        return Inertia::render('Home', [
            'heroImageUrl' => $heroProduct
                ? $images->url($heroProduct->image_url, ProductImageSize::Hero)
                : null,
            'heroProductName' => $heroProduct?->name,
            'heroProduct' => $heroProduct ? [
                'name' => $heroProduct->name,
                'slug' => $heroProduct->slug,
                'brand' => $heroProduct->brand,
                'imageUrl' => $images->url($heroProduct->image_url, ProductImageSize::Card),
            ] : null,
            'featuredProducts' => ProductResource::collection($featuredProducts),
            'categories' => CategoryResource::collection($cache->categories()),
            // Below the fold — loaded only when scrolled into view (WhenVisible)
            'newArrivals' => Inertia::optional(
                fn () => ProductResource::collection($cache->homeNewArrivals()),
            ),
        ]);
    }
}
