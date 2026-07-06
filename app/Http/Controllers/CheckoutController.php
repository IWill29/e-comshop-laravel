<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\CreateCheckoutSessionAction;
use App\DTOs\CheckoutData;
use App\Http\Requests\StoreCheckoutRequest;
use App\Models\Order;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Inertia\Support\Header;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class CheckoutController extends Controller
{
    public function index(Request $request, CartService $cart): Response
    {
        return Inertia::render('Checkout/Index', [
            'items' => $cart->toFrontendItems(),
            'summary' => $cart->summary(),
            'defaults' => [
                'email' => $request->user()?->email ?? '',
                'name' => '',
                'line1' => '',
                'line2' => '',
                'city' => '',
                'state' => '',
                'postalCode' => '',
                'country' => 'US',
            ],
        ]);
    }

    public function store(
        StoreCheckoutRequest $request,
        CreateCheckoutSessionAction $createCheckoutSession,
    ): RedirectResponse|SymfonyResponse {
        $checkoutUrl = $createCheckoutSession->handle(
            CheckoutData::fromValidated($request->validated()),
            $request->user(),
        );

        return Inertia::location($checkoutUrl);
    }

    public function success(Request $request): Response
    {
        $sessionId = $request->string('session_id')->toString();

        $order = null;

        if ($sessionId !== '') {
            $found = Order::query()
                ->with('items')
                ->where('stripe_session_id', $sessionId)
                ->first();

            if ($found !== null) {
                $order = [
                    'id' => $found->id,
                    'number' => str_pad((string) $found->id, 6, '0', STR_PAD_LEFT),
                    'email' => $found->email,
                    'total' => $found->total,
                    'currency' => $found->currency,
                    'placedAt' => $found->created_at?->toIso8601String() ?? now()->toIso8601String(),
                    'items' => $found->items->map(fn ($item): array => [
                        'productName' => $item->product_name,
                        'size' => $item->size,
                        'quantity' => $item->quantity,
                        'unitPrice' => $item->unit_price,
                    ])->values()->all(),
                ];
            }
        }

        return Inertia::render('Checkout/Success', [
            'order' => $order,
        ]);
    }

    public function cancel(): Response
    {
        return Inertia::render('Checkout/Cancel', [
            'message' => null,
        ]);
    }
}
