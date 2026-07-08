<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Enums\ProductImageSize;
use App\Models\Category;
use App\Services\ProductImageService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Category */
class CategoryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $images = app(ProductImageService::class);
        $publicId = config("categories.images.{$this->slug}");
        $publicId = is_string($publicId) ? $publicId : '';

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'productCount' => $this->whenCounted('products'),
            'imageUrl' => $publicId !== ''
                ? $images->url($publicId, ProductImageSize::Card)
                : '',
        ];
    }
}
