<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\Product;
use Cloudinary\Api\Upload\UploadApi;
use Cloudinary\Configuration\Configuration;
use Illuminate\Console\Command;
use Throwable;

class SyncProductImagesCommand extends Command
{
    protected $signature = 'products:sync-images
                            {--dry-run : Show what would be uploaded without changing the database}';

    protected $description = 'Upload external product image URLs to Cloudinary CDN';

    public function handle(): int
    {
        $cloudinaryUrl = config('cloudinary.url');

        if (! is_string($cloudinaryUrl) || $cloudinaryUrl === '') {
            $this->error('CLOUDINARY_URL is not configured. Set it in .env or Vercel Dashboard.');

            return self::FAILURE;
        }

        $folder = config('cloudinary.folder', 'ecomshop/products');
        $dryRun = (bool) $this->option('dry-run');
        $configuration = new Configuration("{$cloudinaryUrl}?secure=true");
        $uploadApi = new UploadApi($configuration);

        $products = Product::query()
            ->whereNotNull('image_url')
            ->where('image_url', '!=', '')
            ->get();

        $synced = 0;
        $skipped = 0;

        foreach ($products as $product) {
            $imageUrl = $product->image_url;

            if (! is_string($imageUrl) || $imageUrl === '') {
                $skipped++;

                continue;
            }

            if (! $this->isExternalUrl($imageUrl)) {
                $this->line("  skip {$product->slug} — already on Cloudinary");
                $skipped++;

                continue;
            }

            if ($dryRun) {
                $this->line("  would upload {$product->slug} ← {$imageUrl}");
                $synced++;

                continue;
            }

            try {
                $response = $uploadApi->upload($imageUrl, [
                    'asset_folder' => $folder,
                    'public_id' => $product->slug,
                    'overwrite' => true,
                    'tags' => ['ecomshop', 'product', $product->slug],
                ]);

                $publicId = $response['public_id'] ?? $product->slug;

                $product->update(['image_url' => $publicId]);

                $this->info("  synced {$product->slug} → {$publicId}");
                $synced++;
            } catch (Throwable $exception) {
                $this->warn("  failed {$product->slug}: {$exception->getMessage()}");
            }
        }

        $this->newLine();
        $this->info("Done. Synced: {$synced}, skipped: {$skipped}".($dryRun ? ' (dry run)' : ''));

        return self::SUCCESS;
    }

    private function isExternalUrl(string $value): bool
    {
        return str_starts_with($value, 'http://') || str_starts_with($value, 'https://');
    }
}
