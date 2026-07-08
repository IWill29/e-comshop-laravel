<?php

declare(strict_types=1);

namespace Tests\Unit;

use App\Enums\ProductImageSize;
use App\Services\ProductImageService;
use Tests\TestCase;

class ProductImageServiceTest extends TestCase
{
    private const DEMO_CLOUD_NAME = 'demo';

    private const DEMO_UPLOAD_CDN_PREFIX = 'res.cloudinary.com/demo/image/upload/';

    /**
     * @param  array<string, mixed>  $extra
     */
    private function configureDemoCloudinary(array $extra = []): void
    {
        config(array_merge([
            'cloudinary.cloud_name' => self::DEMO_CLOUD_NAME,
            'cloudinary.url' => null,
        ], $extra));
    }

    public function test_returns_original_url_when_cloudinary_is_not_configured(): void
    {
        config(['cloudinary.url' => null, 'cloudinary.cloud_name' => null]);

        $service = new ProductImageService;
        $source = 'https://example.com/shoe.jpg';

        $this->assertSame($source, $service->url($source, ProductImageSize::Card));
        $this->assertFalse($service->isEnabled());
    }

    public function test_returns_empty_string_for_empty_source(): void
    {
        $this->configureDemoCloudinary();

        $service = new ProductImageService;

        $this->assertSame('', $service->url(null));
        $this->assertSame('', $service->url(''));
    }

    public function test_builds_fetch_cdn_url_for_external_images(): void
    {
        $this->configureDemoCloudinary([
            'cloudinary.transformations.card' => 'ecomshop_card',
        ]);

        $service = new ProductImageService;
        $source = 'https://example.com/shoe.jpg';

        $url = $service->url($source, ProductImageSize::Card);

        $this->assertStringContainsString('res.cloudinary.com/demo/image/fetch/', $url);
        $this->assertStringContainsString('t_ecomshop_card', $url);
        $this->assertStringContainsString('f_auto', $url);
        $this->assertStringContainsString('q_auto', $url);
    }

    public function test_builds_upload_cdn_url_for_cloudinary_public_id(): void
    {
        $this->configureDemoCloudinary([
            'cloudinary.transformations.detail' => 'ecomshop_detail',
        ]);

        $service = new ProductImageService;

        $url = $service->url('nike-air-max-90', ProductImageSize::Detail);

        $this->assertStringContainsString(self::DEMO_UPLOAD_CDN_PREFIX, $url);
        $this->assertStringContainsString('t_ecomshop_detail', $url);
        $this->assertStringContainsString('nike-air-max-90', $url);
    }

    public function test_builds_hero_cdn_url_for_home_featured_image(): void
    {
        $this->configureDemoCloudinary([
            'cloudinary.transformations.hero' => 'ecomshop_hero',
        ]);

        $service = new ProductImageService;

        $url = $service->url('nike-air-max-90', ProductImageSize::Hero);

        $this->assertStringContainsString(self::DEMO_UPLOAD_CDN_PREFIX, $url);
        $this->assertStringContainsString('t_ecomshop_hero', $url);
        $this->assertStringContainsString('nike-air-max-90', $url);
    }

    public function test_extracts_public_id_from_cloudinary_secure_url(): void
    {
        $this->configureDemoCloudinary([
            'cloudinary.transformations.card' => 'ecomshop_card',
        ]);

        $service = new ProductImageService;
        $source = 'https://res.cloudinary.com/demo/image/upload/v1783421979/nike-air-max-90.jpg';

        $url = $service->url($source, ProductImageSize::Card);

        $this->assertStringContainsString(self::DEMO_UPLOAD_CDN_PREFIX, $url);
        $this->assertStringContainsString('nike-air-max-90', $url);
        $this->assertStringNotContainsString('v1783421979', $url);
    }

    public function test_is_enabled_with_cloud_name_only(): void
    {
        config([
            'cloudinary.cloud_name' => 'rnihysop',
            'cloudinary.url' => null,
        ]);

        $service = new ProductImageService;

        $this->assertTrue($service->isEnabled());
        $this->assertStringContainsString(
            'res.cloudinary.com/rnihysop/',
            $service->url('nike-air-max-90', ProductImageSize::Card),
        );
    }
}
