<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Services\ShopCacheService;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(ShopCacheService $cache): Response
    {
        return Inertia::render('Home', [
            'featuredProducts' => ProductResource::collection($cache->homeFeaturedProducts()),
            'newArrivals' => ProductResource::collection($cache->homeNewArrivals()),
            'categories' => CategoryResource::collection($cache->categories()),
        ]);
    }
}
