<?php

declare(strict_types=1);

namespace App\Models;

use App\DTOs\CatalogFiltersData;
use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'category_id',
    'name',
    'slug',
    'sku',
    'description',
    'brand',
    'gender',
    'color',
    'sizes',
    'price',
    'compare_at_price',
    'stock',
    'image_url',
    'is_active',
    'is_featured',
])]
class Product extends Model
{
    /** @use HasFactory<ProductFactory> */
    use HasFactory;

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * @param  Builder<Product>  $query
     * @return Builder<Product>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * @param  Builder<Product>  $query
     * @return Builder<Product>
     */
    public function scopeCatalogFilter(Builder $query, CatalogFiltersData $filters): Builder
    {
        return $query
            ->when(
                $filters->categorySlug,
                fn (Builder $builder): Builder => $builder->whereHas(
                    'category',
                    fn (Builder $categoryQuery): Builder => $categoryQuery->where('slug', $filters->categorySlug),
                ),
            )
            ->when(
                $filters->gender,
                fn (Builder $builder): Builder => $builder->where('gender', $filters->gender),
            )
            ->when(
                $filters->brand,
                fn (Builder $builder): Builder => $builder->where('brand', $filters->brand),
            )
            ->when(
                $filters->minPrice !== null,
                fn (Builder $builder): Builder => $builder->where('price', '>=', $filters->minPrice),
            )
            ->when(
                $filters->maxPrice !== null,
                fn (Builder $builder): Builder => $builder->where('price', '<=', $filters->maxPrice),
            )
            ->when(
                $filters->size !== null,
                fn (Builder $builder): Builder => $builder->whereJsonContains('sizes', $filters->size),
            )
            ->when(
                $filters->search !== null,
                fn (Builder $builder): Builder => $builder->search($filters->search),
            )
            ->when(
                $filters->onSaleOnly,
                fn (Builder $builder): Builder => $builder->onSale(),
            );
    }

    /**
     * @param  Builder<Product>  $query
     * @return Builder<Product>
     */
    public function scopeOnSale(Builder $query): Builder
    {
        return $query
            ->whereNotNull('compare_at_price')
            ->whereColumn('compare_at_price', '>', 'price');
    }

    /**
     * @param  Builder<Product>  $query
     * @return Builder<Product>
     */
    public function scopeSearch(Builder $query, string $term): Builder
    {
        $like = '%'.addcslashes($term, '%_\\').'%';

        return $query->where(function (Builder $builder) use ($like): void {
            $builder
                ->where('name', 'like', $like)
                ->orWhere('brand', 'like', $like)
                ->orWhere('sku', 'like', $like);
        });
    }

    /**
     * @return BelongsTo<Category, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * @return HasMany<OrderItem, $this>
     */
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sizes' => 'array',
            'price' => 'integer',
            'compare_at_price' => 'integer',
            'stock' => 'integer',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
        ];
    }
}
