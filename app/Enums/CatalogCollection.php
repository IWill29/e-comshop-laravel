<?php

declare(strict_types=1);

namespace App\Enums;

enum CatalogCollection: string
{
    case Sale = 'sale';
    case NewArrivals = 'new_arrivals';
}
