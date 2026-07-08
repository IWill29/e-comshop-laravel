<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Facades\Cache;
use Throwable;

class ShopCacheService
{
    private const KEY_CATEGORIES = 'shop.categories.v4';

    private const KEY_FILTER_OPTIONS = 'shop.filter_options.v2';

    private const KEY_HOME_FEATURED = 'shop.home.featured.v2';

    private const KEY_HOME_NEW_ARRIVALS = 'shop.home.new_arrivals.v2';

    /**
     * @return EloquentCollection<int, Category>
     */
    public function categories(): EloquentCollection
    {
        /** @var EloquentCollection<int, Category> $categories */
        $categories = $this->remember(
            self::KEY_CATEGORIES,
            now()->addHour(),
            fn (): EloquentCollection => Category::query()
                ->withCount(['products' => fn ($query) => $query->where('is_active', true)])
                ->orderBy('name')
                ->get(),
        );

        return $categories;
    }

    /**
     * @return EloquentCollection<int, Product>
     */
    public function homeFeaturedProducts(): EloquentCollection
    {
        /** @var EloquentCollection<int, Product> $products */
        $products = $this->remember(
            self::KEY_HOME_FEATURED,
            now()->addHour(),
            fn (): EloquentCollection => Product::query()
                ->with('category')
                ->where('is_active', true)
                ->where('is_featured', true)
                ->limit(4)
                ->get(),
        );

        return $products;
    }

    /**
     * @return EloquentCollection<int, Product>
     */
    public function homeNewArrivals(): EloquentCollection
    {
        /** @var EloquentCollection<int, Product> $products */
        $products = $this->remember(
            self::KEY_HOME_NEW_ARRIVALS,
            now()->addMinutes(15),
            fn (): EloquentCollection => Product::query()
                ->with('category')
                ->where('is_active', true)
                ->latest()
                ->limit(8)
                ->get(),
        );

        return $products;
    }

    /**
     * @return array{
     *     brands: list<string>,
     *     genders: list<string>,
     *     sizes: list<int>,
     *     priceRange: array{min: int, max: int}
     * }
     */
    public function filterOptions(): array
    {
        /** @var array{
         *     brands: list<string>,
         *     genders: list<string>,
         *     sizes: list<int>,
         *     priceRange: array{min: int, max: int}
         * } $options */
        $options = $this->remember(
            self::KEY_FILTER_OPTIONS,
            now()->addMinutes(30),
            fn (): array => $this->buildFilterOptions(),
        );

        return $options;
    }

    /**
     * @return array{
     *     brands: list<string>,
     *     genders: list<string>,
     *     sizes: list<int>,
     *     priceRange: array{min: int, max: int}
     * }
     */
    private function buildFilterOptions(): array
    {
        $activeProducts = Product::query()->active();

        $priceRange = (clone $activeProducts)
            ->toBase()
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
                'min' => (int) ($priceRange->min_price ?? 0),
                'max' => (int) ($priceRange->max_price ?? 0),
            ],
        ];
    }

    /**
     * @template T
     *
     * @param  callable(): T  $callback
     * @return T
     */
    private function remember(string $key, \DateTimeInterface|\DateInterval|int|null $ttl, callable $callback): mixed
    {
        try {
            $cached = Cache::get($key);

            if ($cached !== null && ! $this->isValidCachedValue($cached)) {
                Cache::forget($key);
                $cached = null;
            }

            if ($cached !== null) {
                return $cached;
            }

            $value = $callback();
            Cache::put($key, $value, $ttl);

            return $value;
        } catch (Throwable) {
            Cache::forget($key);

            return $callback();
        }
    }

    private function isValidCachedValue(mixed $value): bool
    {
        if (! is_object($value)) {
            return true;
        }

        return get_class($value) !== '__PHP_Incomplete_Class';
    }
}
