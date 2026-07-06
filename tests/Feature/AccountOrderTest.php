<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AccountOrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_view_account_orders(): void
    {
        $this->get(route('account.orders.index'))
            ->assertRedirect(route('login'));
    }

    public function test_user_can_view_their_orders(): void
    {
        $user = User::factory()->create();

        Order::factory()->create([
            'user_id' => $user->id,
            'email' => $user->email,
        ]);

        $this->actingAs($user)
            ->get(route('account.orders.index'))
            ->assertOk();
    }

    public function test_user_cannot_view_another_users_order(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $order = Order::factory()->create([
            'user_id' => $otherUser->id,
            'email' => $otherUser->email,
        ]);

        $this->actingAs($user)
            ->get(route('account.orders.show', $order))
            ->assertForbidden();
    }
}
