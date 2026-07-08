<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\AddToCartAction;
use App\Http\Requests\StoreAddToCartRequest;
use App\Http\Requests\UpdateCartItemRequest;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(CartService $cart): Response
    {
        return Inertia::render('Cart/Index', [
            'items' => $cart->toCartPageItems(),
            'subtotal' => $cart->subtotal(),
            'itemCount' => $cart->count(),
        ]);
    }

    public function store(
        Product $product,
        StoreAddToCartRequest $request,
        AddToCartAction $addToCart,
    ): RedirectResponse {
        abort_unless($product->is_active, 404);

        $validated = $request->validated();

        $addToCart->handle(
            $product,
            (int) $validated['size'],
            (int) ($validated['quantity'] ?? 1),
        );

        return back();
    }

    public function update(
        string $key,
        UpdateCartItemRequest $request,
        CartService $cart,
    ): RedirectResponse {
        $cart->updateQuantity($key, (int) $request->validated('quantity'));

        return back();
    }

    public function destroy(string $key, CartService $cart): RedirectResponse
    {
        $cart->remove($key);

        return back();
    }
}
