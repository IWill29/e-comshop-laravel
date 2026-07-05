<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Models\Product;
use InvalidArgumentException;

readonly class CartItemData
{
    public function __construct(
        public int $productId,
        public string $name,
        public string $slug,
        public string $brand,
        public int $size,
        public int $quantity,
        public int $unitPrice,
        public string $imageUrl,
    ) {}

    public function key(): string
    {
        return "{$this->productId}-{$this->size}";
    }

    public function lineTotal(): int
    {
        return $this->unitPrice * $this->quantity;
    }

    public static function fromProduct(Product $product, int $size, int $quantity): self
    {
        return new self(
            productId: $product->id,
            name: $product->name,
            slug: $product->slug,
            brand: $product->brand,
            size: $size,
            quantity: $quantity,
            unitPrice: $product->price,
            imageUrl: $product->image_url ?? '',
        );
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public static function tryFromArray(array $data): ?self
    {
        $requiredKeys = ['productId', 'name', 'slug', 'brand', 'size', 'quantity', 'unitPrice'];

        foreach ($requiredKeys as $key) {
            if (! array_key_exists($key, $data)) {
                return null;
            }
        }

        $productId = filter_var($data['productId'], FILTER_VALIDATE_INT);
        $size = filter_var($data['size'], FILTER_VALIDATE_INT);
        $quantity = filter_var($data['quantity'], FILTER_VALIDATE_INT);
        $unitPrice = filter_var($data['unitPrice'], FILTER_VALIDATE_INT);

        if ($productId === false || $productId < 1) {
            return null;
        }

        if ($size === false || $size < 1) {
            return null;
        }

        if ($quantity === false || $quantity < 1) {
            return null;
        }

        if ($unitPrice === false || $unitPrice < 0) {
            return null;
        }

        $name = trim((string) $data['name']);
        $slug = trim((string) $data['slug']);
        $brand = trim((string) $data['brand']);

        if ($name === '' || $slug === '' || $brand === '') {
            return null;
        }

        return new self(
            productId: $productId,
            name: $name,
            slug: $slug,
            brand: $brand,
            size: $size,
            quantity: $quantity,
            unitPrice: $unitPrice,
            imageUrl: (string) ($data['imageUrl'] ?? ''),
        );
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public static function fromArray(array $data): self
    {
        $item = self::tryFromArray($data);

        if ($item === null) {
            throw new InvalidArgumentException('Invalid cart item data.');
        }

        return $item;
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'productId' => $this->productId,
            'name' => $this->name,
            'slug' => $this->slug,
            'brand' => $this->brand,
            'size' => $this->size,
            'quantity' => $this->quantity,
            'unitPrice' => $this->unitPrice,
            'imageUrl' => $this->imageUrl,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function toFrontendArray(): array
    {
        return [
            'key' => $this->key(),
            ...$this->toArray(),
        ];
    }
}
