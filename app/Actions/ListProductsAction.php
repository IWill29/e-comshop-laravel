<?php

declare(strict_types=1);

namespace App\Actions;

use App\DTOs\CatalogFiltersData;
use App\Enums\CatalogCollection;
use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class ListProductsAction
{
    /**
     * @return LengthAwarePaginator<int, Product>
     */
    public function handle(
        CatalogFiltersData $filters,
        int $perPage = 12,
        ?CatalogCollection $collection = null,
    ): LengthAwarePaginator {
        $query = Product::query()
            ->with('category')
            ->active()
            ->catalogFilter($filters);

        if ($filters->searchQuery !== null) {
            $query->search($filters->searchQuery);
        }

        if ($collection === CatalogCollection::Sale) {
            $query->onSale();
        }

        if ($collection === CatalogCollection::NewArrivals) {
            $query->newArrival();
        }

        $sort = $collection === CatalogCollection::NewArrivals ? 'newest' : $filters->sort;

        $query = $this->applySort($query, $sort);

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
