<?php

declare(strict_types=1);

namespace App\Support;

final class CustomerRedirect
{
    public static function url(bool $absolute = false): string
    {
        return route('home', absolute: $absolute);
    }
}
