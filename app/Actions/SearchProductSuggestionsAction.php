<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;

class SearchProductSuggestionsAction
{
    /**
     * @return Collection<int, Product>
     */
    public function handle(string $query, int $limit = 8): Collection
    {
        $query = trim($query);

        if (mb_strlen($query) < 2) {
            return new Collection;
        }

        return Product::query()
            ->with('category')
            ->active()
            ->search($query)
            ->orderByDesc('is_featured')
            ->orderBy('name')
            ->limit($limit)
            ->get();
    }
}
