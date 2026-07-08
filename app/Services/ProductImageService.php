<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\ProductImageSize;
use Cloudinary\Asset\Image;
use Cloudinary\Configuration\Configuration;
use Cloudinary\Transformation\Format;
use Cloudinary\Transformation\NamedTransformation;
use Cloudinary\Transformation\Quality;

class ProductImageService
{
    private ?Configuration $configuration = null;

    public function isEnabled(): bool
    {
        return $this->cloudName() !== null;
    }

    public function url(?string $source, ProductImageSize $size = ProductImageSize::Card): string
    {
        if ($source === null || $source === '') {
            return '';
        }

        if ($this->isEnabled()) {
            if ($size === ProductImageSize::Detail) {
                return $this->detailUrl($source);
            }

            $transformationName = config(
                "cloudinary.transformations.{$size->value}",
                'ecomshop_card',
            );

            if (is_string($transformationName) && $transformationName !== '') {
                return $this->transformedUrl($source, $transformationName);
            }
        }

        return $source;
    }

    /**
     * Product detail reuses the card transform URL so listing and PDP show the same image.
     */
    private function detailUrl(string $source): string
    {
        $cardTransform = config('cloudinary.transformations.card', 'ecomshop_card');

        if (! is_string($cardTransform) || $cardTransform === '') {
            return $source;
        }

        return $this->transformedUrl($source, $cardTransform);
    }

    private function transformedUrl(string $source, string $transformationName): string
    {
        $image = $this->buildImage($source);

        $image
            ->addTransformation(NamedTransformation::name($transformationName))
            ->format(Format::auto())
            ->quality(Quality::auto());

        return (string) $image->toUrl();
    }

    private function buildImage(string $source): Image
    {
        $configuration = $this->configuration();

        if ($this->isCloudinaryHosted($source)) {
            return Image::upload($this->extractPublicId($source), $configuration);
        }

        if ($this->isExternalUrl($source)) {
            return Image::fetch($source, $configuration);
        }

        return Image::upload($source, $configuration);
    }

    private function configuration(): Configuration
    {
        if ($this->configuration === null) {
            $url = config('cloudinary.url');

            if (is_string($url) && $url !== '') {
                $this->configuration = new Configuration("{$url}?secure=true");
            } else {
                $cloudName = $this->cloudName();

                $this->configuration = new Configuration([
                    'cloud' => ['cloud_name' => $cloudName],
                    'url' => ['secure' => true],
                ]);
            }
        }

        return $this->configuration;
    }

    private function cloudName(): ?string
    {
        $cloudName = config('cloudinary.cloud_name');

        if (is_string($cloudName) && $cloudName !== '') {
            return $cloudName;
        }

        $url = config('cloudinary.url');

        if (is_string($url) && $url !== '' && preg_match('#@([^/?]+)#', $url, $matches) === 1) {
            return $matches[1];
        }

        return null;
    }

    private function isExternalUrl(string $value): bool
    {
        return str_starts_with($value, 'http://') || str_starts_with($value, 'https://');
    }

    private function isCloudinaryHosted(string $value): bool
    {
        return str_contains($value, 'res.cloudinary.com/');
    }

    private function extractPublicId(string $cloudinaryUrl): string
    {
        $path = parse_url($cloudinaryUrl, PHP_URL_PATH);

        if (is_string($path)) {
            if (preg_match('#/image/upload/(?:[^/]+/)*v\d+/(.+)$#', $path, $matches) === 1) {
                return pathinfo($matches[1], PATHINFO_FILENAME);
            }

            if (preg_match('#/image/upload/(.+)$#', $path, $matches) === 1) {
                return pathinfo(basename($matches[1]), PATHINFO_FILENAME);
            }
        }

        return $cloudinaryUrl;
    }
}
