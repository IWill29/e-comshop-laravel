<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Cart/Index', [
            'items' => [],
            'subtotal' => 0,
            'itemCount' => 0,
        ]);
    }
}
