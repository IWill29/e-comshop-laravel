<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Enums\ProductImageSize;
use App\Models\Product;
use App\Services\ProductImageService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Product */
class ProductResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $images = app(ProductImageService::class);
        $size = $request->routeIs('shop.search.suggestions')
            ? ProductImageSize::Thumbnail
            : ProductImageSize::Card;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'brand' => $this->brand,
            'color' => $this->color,
            'price' => $this->price,
            'compareAtPrice' => $this->compare_at_price,
            'imageUrl' => $images->url($this->image_url, $size),
            'category' => $this->whenLoaded('category', fn (): array => [
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ]),
        ];
    }
}
