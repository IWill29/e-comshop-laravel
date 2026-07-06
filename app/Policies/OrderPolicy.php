<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Order;
use App\Models\User;

class OrderPolicy
{
    public function view(User $user, Order $order): bool
    {
        if ($order->user_id !== null && $order->user_id === $user->id) {
            return true;
        }

        return strcasecmp($order->email, $user->email) === 0;
    }
}
