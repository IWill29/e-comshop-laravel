<?php

declare(strict_types=1);

namespace App\Enums;

enum ProductImageSize: string
{
    case Card = 'card';
    case Detail = 'detail';
    case Hero = 'hero';
    case Thumbnail = 'thumbnail';
    case Cart = 'cart';
}
