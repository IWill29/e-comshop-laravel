<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Cloudinary connection
    |--------------------------------------------------------------------------
    |
    | CLOUDINARY_URL format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME
    | Find it in Cloudinary Console → Settings → API Keys.
    |
    */

    'url' => env('CLOUDINARY_URL'),

    'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),

    'folder' => env('CLOUDINARY_FOLDER', 'ecomshop/products'),

    /*
    |--------------------------------------------------------------------------
    | Named transformations (created via Cloudinary Console or MCP)
    |--------------------------------------------------------------------------
    |
    | f_auto/q_auto are appended at delivery time (not inside named transforms).
    |
    */

    'transformations' => [
        'card' => env('CLOUDINARY_TRANSFORM_CARD', 'ecomshop_card'),
        'detail' => env('CLOUDINARY_TRANSFORM_DETAIL', 'ecomshop_detail'),
        'hero' => env('CLOUDINARY_TRANSFORM_HERO', 'ecomshop_hero'),
        'thumbnail' => env('CLOUDINARY_TRANSFORM_THUMBNAIL', 'ecomshop_thumbnail'),
        'cart' => env('CLOUDINARY_TRANSFORM_CART', 'ecomshop_cart'),
    ],

];
