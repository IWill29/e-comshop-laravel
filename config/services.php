<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'stripe' => [
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
        'branding' => [
            'display_name' => env('STRIPE_BRANDING_DISPLAY_NAME', 'ParaditX'),
            'background_color' => env('STRIPE_BRANDING_BACKGROUND_COLOR', '#FAFAF9'),
            'button_color' => env('STRIPE_BRANDING_BUTTON_COLOR', '#4F46E5'),
            'border_style' => env('STRIPE_BRANDING_BORDER_STYLE', 'rounded'),
            'font_family' => env('STRIPE_BRANDING_FONT_FAMILY', 'inter'),
            'icon_file' => env('STRIPE_BRANDING_ICON_FILE'),
            'logo_file' => env('STRIPE_BRANDING_LOGO_FILE'),
        ],
    ],

    'cloudinary' => [
        'url' => env('CLOUDINARY_URL'),
    ],

];
