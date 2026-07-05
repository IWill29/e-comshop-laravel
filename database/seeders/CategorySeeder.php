<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Category;
use Database\Seeders\Concerns\LoadsJsonData;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    use LoadsJsonData;

    public function run(): void
    {
        foreach ($this->loadJsonData('demo_categories.json') as $category) {
            Category::query()->updateOrCreate(
                ['slug' => $category['slug']],
                ['name' => $category['name']],
            );
        }
    }
}
