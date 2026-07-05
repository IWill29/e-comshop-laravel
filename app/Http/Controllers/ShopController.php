<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\ListProductsAction;
use App\DTOs\CatalogFiltersData;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShopController extends Controller
{
    public function index(Request $request, ListProductsAction $listProducts): Response
    {
        return $this->catalog($request, $listProducts);
    }

    public function category(Request $request, Category $category, ListProductsAction $listProducts): Response
    {
        return $this->catalog($request, $listProducts, $category);
    }

    public function search(Request $request, ListProductsAction $listProducts): Response
    {
        $filters = CatalogFiltersData::fromRequest($request);
        $query = $filters->search ?? '';

        return $this->catalog(
            $request,
            $listProducts,
            component: 'Shop/Search',
            pageTitle: $query !== '' ? "Search: {$query}" : 'Search',
            pageSubtitle: $query !== ''
                ? 'Results matching your query'
                : 'Find shoes by name, brand, or SKU',
            extraProps: ['query' => $query],
            filters: $filters,
        );
    }

    public function sale(Request $request, ListProductsAction $listProducts): Response
    {
        return $this->catalog(
            $request,
            $listProducts,
            component: 'Shop/Sale',
            pageTitle: 'Sale',
            pageSubtitle: 'Discounted styles while stock lasts',
            filters: CatalogFiltersData::forSale($request),
        );
    }

    public function newArrivals(Request $request, ListProductsAction $listProducts): Response
    {
        return $this->catalog(
            $request,
            $listProducts,
            component: 'Shop/NewArrivals',
            pageTitle: 'New arrivals',
            pageSubtitle: 'The latest drops, sorted newest first',
            filters: CatalogFiltersData::forNewArrivals($request),
        );
    }

    /**
     * @param  array<string, mixed>  $extraProps
     */
    private function catalog(
        Request $request,
        ListProductsAction $listProducts,
        ?Category $category = null,
        string $component = 'Shop/Index',
        ?string $pageTitle = null,
        ?string $pageSubtitle = null,
        array $extraProps = [],
        ?CatalogFiltersData $filters = null,
    ): Response {
        $filters ??= CatalogFiltersData::fromRequest($request, $category);
        $products = $listProducts->handle($filters);

        $categories = Category::query()
            ->withCount(['products' => fn ($query) => $query->where('is_active', true)])
            ->orderBy('name')
            ->get();

        return Inertia::render($component, [
            'category' => $category !== null ? CategoryResource::make($category) : null,
            'products' => ProductResource::collection($products),
            'filters' => $filters->toArray(),
            'filterOptions' => $this->filterOptions(),
            'categories' => CategoryResource::collection($categories),
            'pageTitle' => $pageTitle,
            'pageSubtitle' => $pageSubtitle,
            ...$extraProps,
        ]);
    }

    /**
     * @return array{
     *     brands: list<string>,
     *     genders: list<string>,
     *     sizes: list<int>,
     *     priceRange: array{min: int, max: int}
     * }
     */
    private function filterOptions(): array
    {
        $activeProducts = Product::query()->active();

        $priceRange = (clone $activeProducts)
            ->selectRaw('MIN(price) as min_price, MAX(price) as max_price')
            ->first();

        $sizes = Product::query()
            ->active()
            ->pluck('sizes')
            ->flatten()
            ->unique()
            ->sort()
            ->values()
            ->all();

        return [
            'brands' => (clone $activeProducts)
                ->select('brand')
                ->distinct()
                ->orderBy('brand')
                ->pluck('brand')
                ->all(),
            'genders' => ['men', 'women', 'unisex', 'kids'],
            'sizes' => array_map('intval', $sizes),
            'priceRange' => [
                'min' => (int) ($priceRange?->min_price ?? 0),
                'max' => (int) ($priceRange?->max_price ?? 0),
            ],
        ];
    }
}
