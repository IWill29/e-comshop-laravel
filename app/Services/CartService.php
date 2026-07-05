<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\CartItemData;
use App\Models\Product;
use Illuminate\Contracts\Session\Session;
use Illuminate\Validation\ValidationException;

class CartService
{
    private const SESSION_KEY = 'cart';

    private const CURRENCY = 'usd';

    public function __construct(
        private Session $session,
    ) {}

    /**
     * @return list<CartItemData>
     */
    public function items(): array
    {
        $stored = $this->session->get(self::SESSION_KEY, []);

        if (! is_array($stored)) {
            $this->clear();

            return [];
        }

        $items = [];

        foreach ($stored as $item) {
            if (! is_array($item)) {
                continue;
            }

            $parsed = CartItemData::tryFromArray($item);

            if ($parsed !== null) {
                $items[] = $parsed;
            }
        }

        if (count($items) !== count($stored)) {
            $this->persist($items);
        }

        return $items;
    }

    public function isEmpty(): bool
    {
        return $this->items() === [];
    }

    public function count(): int
    {
        return array_sum(array_map(
            fn (CartItemData $item): int => $item->quantity,
            $this->items(),
        ));
    }

    public function add(Product $product, int $size, int $quantity = 1): void
    {
        if (! $product->is_active) {
            throw ValidationException::withMessages([
                'size' => 'This product is no longer available.',
            ]);
        }

        if ($quantity < 1) {
            throw ValidationException::withMessages([
                'quantity' => 'Quantity must be at least 1.',
            ]);
        }

        $sizes = $product->sizes;

        if (! is_array($sizes) || ! in_array($size, $sizes, true)) {
            throw ValidationException::withMessages([
                'size' => 'Selected size is not available for this product.',
            ]);
        }

        if ($product->stock < $quantity) {
            throw ValidationException::withMessages([
                'quantity' => 'Not enough stock for the selected quantity.',
            ]);
        }

        $items = $this->items();
        $key = "{$product->id}-{$size}";
        $indexed = [];

        foreach ($items as $item) {
            $indexed[$item->key()] = $item;
        }

        $existing = $indexed[$key] ?? null;
        $newQuantity = ($existing?->quantity ?? 0) + $quantity;

        if ($product->stock < $newQuantity) {
            throw ValidationException::withMessages([
                'quantity' => 'Not enough stock for the selected quantity.',
            ]);
        }

        $indexed[$key] = CartItemData::fromProduct($product, $size, $newQuantity);
        $this->persist(array_values($indexed));
    }

    public function subtotal(): int
    {
        return array_sum(array_map(
            fn (CartItemData $item): int => $item->lineTotal(),
            $this->items(),
        ));
    }

    public function shipping(): int
    {
        return 0;
    }

    public function total(): int
    {
        return $this->subtotal() + $this->shipping();
    }

    /**
     * @return array{subtotal: int, shipping: int, total: int, currency: string}
     */
    public function summary(): array
    {
        return [
            'subtotal' => $this->subtotal(),
            'shipping' => $this->shipping(),
            'total' => $this->total(),
            'currency' => self::CURRENCY,
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    public function toFrontendItems(): array
    {
        return array_map(
            fn (CartItemData $item): array => $item->toFrontendArray(),
            $this->items(),
        );
    }

    public function clear(): void
    {
        $this->session->forget(self::SESSION_KEY);
    }

    /**
     * @param  list<CartItemData>  $items
     */
    private function persist(array $items): void
    {
        $this->session->put(
            self::SESSION_KEY,
            array_map(fn (CartItemData $item): array => $item->toArray(), $items),
        );
    }
}
