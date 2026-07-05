<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\ListProductsAction;
use App\Actions\SearchProductSuggestionsAction;
use App\DTOs\CatalogFiltersData;
use App\Enums\CatalogCollection;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShopController extends Controller
{
    public function index(Request $request, ListProductsAction $listProducts): Response
    {
        return $this->catalog($request, $listProducts, 'Shop/Index');
    }

    public function category(Request $request, Category $category, ListProductsAction $listProducts): Response
    {
        return $this->catalog($request, $listProducts, 'Shop/Index', $category);
    }

    public function search(Request $request, ListProductsAction $listProducts): Response
    {
        return $this->catalog($request, $listProducts, 'Shop/Search');
    }

    public function searchSuggestions(
        Request $request,
        SearchProductSuggestionsAction $suggestions,
    ): JsonResponse {
        $query = trim($request->string('q')->toString());

        $products = $suggestions->handle($query);
        $resolved = ProductResource::collection($products)->resolve($request);

        return response()->json([
            'query' => $query,
            'suggestions' => $resolved['data'] ?? $resolved,
        ]);
    }

    public function sale(Request $request, ListProductsAction $listProducts): Response
    {
        return $this->catalog($request, $listProducts, 'Shop/Sale', collection: CatalogCollection::Sale);
    }

    public function newArrivals(Request $request, ListProductsAction $listProducts): Response
    {
        return $this->catalog($request, $listProducts, 'Shop/NewArrivals', collection: CatalogCollection::NewArrivals);
    }

    private function catalog(
        Request $request,
        ListProductsAction $listProducts,
        string $component,
        ?Category $category = null,
        ?CatalogCollection $collection = null,
    ): Response {
        $filters = CatalogFiltersData::fromRequest($request, $category);
        $products = $listProducts->handle($filters, collection: $collection);

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
