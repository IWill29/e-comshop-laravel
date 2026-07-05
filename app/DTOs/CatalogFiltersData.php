<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Models\Category;
use Illuminate\Http\Request;

readonly class CatalogFiltersData
{
    private const SORT_OPTIONS = ['newest', 'price_asc', 'price_desc'];

    private const GENDER_OPTIONS = ['men', 'women', 'unisex', 'kids'];

    public function __construct(
        public ?string $categorySlug,
        public ?string $gender,
        public ?string $brand,
        public ?int $minPrice,
        public ?int $maxPrice,
        public ?int $size,
        public string $sort,
        public ?string $search = null,
        public bool $onSaleOnly = false,
    ) {}

    public static function fromRequest(Request $request, ?Category $category = null): self
    {
        $sort = $request->string('sort')->toString();
        $gender = $request->string('gender')->toString();
        $brand = $request->string('brand')->toString();
        $search = trim($request->string('q')->toString());

        return new self(
            categorySlug: $category?->slug,
            gender: in_array($gender, self::GENDER_OPTIONS, true) ? $gender : null,
            brand: $brand !== '' ? $brand : null,
            minPrice: self::nullableInt($request->input('min_price')),
            maxPrice: self::nullableInt($request->input('max_price')),
            size: self::nullableInt($request->input('size')),
            sort: in_array($sort, self::SORT_OPTIONS, true) ? $sort : 'newest',
            search: $search !== '' ? $search : null,
        );
    }

    public static function forSale(Request $request): self
    {
        $filters = self::fromRequest($request);

        return new self(
            categorySlug: $filters->categorySlug,
            gender: $filters->gender,
            brand: $filters->brand,
            minPrice: $filters->minPrice,
            maxPrice: $filters->maxPrice,
            size: $filters->size,
            sort: $filters->sort,
            search: $filters->search,
            onSaleOnly: true,
        );
    }

    public static function forNewArrivals(Request $request): self
    {
        $filters = self::fromRequest($request);

        return new self(
            categorySlug: $filters->categorySlug,
            gender: $filters->gender,
            brand: $filters->brand,
            minPrice: $filters->minPrice,
            maxPrice: $filters->maxPrice,
            size: $filters->size,
            sort: 'newest',
            search: $filters->search,
        );
    }

    /**
     * @return array<string, int|string|null>
     */
    public function toArray(): array
    {
        return [
            'gender' => $this->gender,
            'brand' => $this->brand,
            'minPrice' => $this->minPrice,
            'maxPrice' => $this->maxPrice,
            'size' => $this->size,
            'sort' => $this->sort,
            'search' => $this->search,
        ];
    }

    public function hasActiveFilters(): bool
    {
        return $this->gender !== null
            || $this->brand !== null
            || $this->minPrice !== null
            || $this->maxPrice !== null
            || $this->size !== null
            || $this->search !== null
            || $this->sort !== 'newest';
    }

    private static function nullableInt(mixed $value): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }

        $int = filter_var($value, FILTER_VALIDATE_INT);

        return $int === false ? null : $int;
    }
}
