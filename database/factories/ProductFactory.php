<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->words(3, true);
        $price = fake()->numberBetween(4999, 24999);

        return [
            'category_id' => Category::factory(),
            'name' => ucwords($name),
            'slug' => Str::slug($name.'-'.fake()->unique()->numerify('###')),
            'sku' => strtoupper(fake()->unique()->bothify('PX-####-??')),
            'description' => fake()->paragraph(),
            'brand' => fake()->randomElement(['Nike', 'Adidas', 'New Balance', 'Puma', 'Reebok', 'Converse']),
            'gender' => fake()->randomElement(['men', 'women', 'unisex', 'kids']),
            'color' => fake()->randomElement(['Black', 'White', 'Brown', 'Grey', 'Navy', 'Red']),
            'sizes' => fake()->randomElements(range(36, 46), fake()->numberBetween(4, 8)),
            'price' => $price,
            'compare_at_price' => fake()->boolean(20) ? $price + fake()->numberBetween(1000, 5000) : null,
            'stock' => fake()->numberBetween(5, 50),
            'image_url' => 'https://images.unsplash.com/photo-'.fake()->randomElement([
                '1542291026-7eec264c27ff',
                '1606107557195-0be29b4b5b0b',
                '1608231388042-1630b4e282a9',
                '1595950653106-6c9ebd614d3a',
            ]).'?w=800&q=80',
            'is_active' => true,
            'is_featured' => fake()->boolean(25),
        ];
    }

    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    public function onSale(): static
    {
        return $this->state(function (array $attributes): array {
            $price = $attributes['price'] ?? fake()->numberBetween(4999, 14999);

            return [
                'price' => $price,
                'compare_at_price' => $price + fake()->numberBetween(1000, 5000),
            ];
        });
    }
}
