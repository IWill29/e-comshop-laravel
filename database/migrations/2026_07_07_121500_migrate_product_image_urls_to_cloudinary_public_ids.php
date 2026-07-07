<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('products')
            ->where('image_url', 'like', 'http%')
            ->update([
                'image_url' => DB::raw('slug'),
            ]);
    }

    public function down(): void
    {
        // Re-seed from database/data/demo_products.json on fresh install.
    }
};
