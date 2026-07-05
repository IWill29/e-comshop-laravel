<?php

declare(strict_types=1);

namespace App\Actions;

use App\DTOs\CatalogFiltersData;
use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class ListProductsAction
{
    /**
     * @return LengthAwarePaginator<int, Product>
     */
    public function handle(CatalogFiltersData $filters, int $perPage = 12): LengthAwarePaginator
    {
        $query = Product::query()
            ->with('category')
            ->active()
            ->catalogFilter($filters);

        $query = $this->applySort($query, $filters->sort);

        return $query->paginate($perPage)->withQueryString();
    }

    /**
     * @param  Builder<Product>  $query
     * @return Builder<Product>
     */
    private function applySort(Builder $query, string $sort): Builder
    {
        return match ($sort) {
            'newest' => $query->orderByDesc('created_at'),
            'price_asc' => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            default => $query->orderByDesc('created_at'),
        };
    }
}
