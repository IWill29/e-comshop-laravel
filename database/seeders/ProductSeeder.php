<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Database\Seeders\Concerns\LoadsJsonData;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    use LoadsJsonData;

    public function run(): void
    {
        $categories = Category::query()->pluck('id', 'slug');

        foreach ($this->loadJsonData('demo_products.json') as $product) {
            $categorySlug = $product['category'];
            unset($product['category']);

            Product::query()->updateOrCreate(
                ['slug' => $product['slug']],
                [
                    ...$product,
                    'category_id' => $categories[$categorySlug],
                    'is_active' => true,
                ],
            );
        }
    }
}
