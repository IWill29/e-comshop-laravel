<?php

declare(strict_types=1);

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();

        $orders = Order::query()
            ->where(function ($query) use ($user): void {
                $query->where('user_id', $user->id)
                    ->orWhere('email', $user->email);
            })
            ->withCount('items')
            ->latest()
            ->paginate(10)
            ->through(fn (Order $order): array => $this->summarizeOrder($order));

        return Inertia::render('Account/Orders', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order): Response
    {
        $this->authorize('view', $order);

        $order->load('items');

        return Inertia::render('Account/OrderShow', [
            'order' => $this->detailOrder($order),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function summarizeOrder(Order $order): array
    {
        return [
            'id' => $order->id,
            'number' => $this->orderNumber($order),
            'total' => $order->total,
            'currency' => $order->currency,
            'status' => $order->orderStatus()->value,
            'paymentStatus' => $order->paymentStatus()->value,
            'itemCount' => (int) $order->items_count,
            'placedAt' => $order->created_at?->toIso8601String() ?? now()->toIso8601String(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function detailOrder(Order $order): array
    {
        return [
            ...$this->summarizeOrder($order),
            'email' => $order->email,
            'items' => $order->items->map(fn ($item): array => [
                'productName' => $item->product_name,
                'size' => $item->size,
                'quantity' => $item->quantity,
                'unitPrice' => $item->unit_price,
            ])->values()->all(),
        ];
    }

    private function orderNumber(Order $order): string
    {
        return str_pad((string) $order->id, 6, '0', STR_PAD_LEFT);
    }
}
