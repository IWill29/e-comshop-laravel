<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Enums\ProductImageSize;
use App\Models\Product;
use App\Services\ProductImageService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Product */
class ProductDetailResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $images = app(ProductImageService::class);

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'sku' => $this->sku,
            'brand' => $this->brand,
            'gender' => $this->gender,
            'color' => $this->color,
            'description' => $this->description,
            'price' => $this->price,
            'compareAtPrice' => $this->compare_at_price,
            'stock' => $this->stock,
            'sizes' => $this->sizes,
            'imageUrl' => $images->url($this->image_url, ProductImageSize::Detail),
            'category' => $this->whenLoaded('category', fn (): array => [
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ]),
        ];
    }
}
