<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * @var list<array{name: string, slug: string}>
     */
    private const CATEGORIES = [
        ['name' => "Men's Shoes", 'slug' => 'mens'],
        ['name' => "Women's Shoes", 'slug' => 'womens'],
        ['name' => "Kids' Shoes", 'slug' => 'kids'],
        ['name' => 'Sneakers', 'slug' => 'sneakers'],
        ['name' => 'Boots', 'slug' => 'boots'],
        ['name' => 'Sandals', 'slug' => 'sandals'],
        ['name' => 'Running', 'slug' => 'running'],
        ['name' => 'Casual', 'slug' => 'casual'],
    ];

    public function run(): void
    {
        foreach (self::CATEGORIES as $category) {
            Category::query()->updateOrCreate(
                ['slug' => $category['slug']],
                ['name' => $category['name']],
            );
        }
    }
}
