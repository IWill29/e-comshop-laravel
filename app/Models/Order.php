<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use Database\Factories\OrderFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property OrderStatus $status
 * @property PaymentStatus $payment_status
 * @property int $total
 * @property string $currency
 * @property string $email
 * @property string|null $stripe_session_id
 */
#[Fillable([
    'user_id',
    'email',
    'status',
    'payment_status',
    'stripe_session_id',
    'total',
    'currency',
])]
class Order extends Model
{
    /** @use HasFactory<OrderFactory> */
    use HasFactory, SoftDeletes;

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return HasMany<OrderItem, $this>
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function isPaid(): bool
    {
        return $this->paymentStatus() === PaymentStatus::Paid;
    }

    public function isPaymentPending(): bool
    {
        return $this->paymentStatus() === PaymentStatus::Pending;
    }

    public function paymentStatus(): PaymentStatus
    {
        return $this->enumValue('payment_status', PaymentStatus::class);
    }

    public function orderStatus(): OrderStatus
    {
        return $this->enumValue('status', OrderStatus::class);
    }

    /**
     * @template TEnum of \BackedEnum
     *
     * @param  class-string<TEnum>  $enumClass
     * @return TEnum
     */
    private function enumValue(string $attribute, string $enumClass): \BackedEnum
    {
        $value = $this->getAttribute($attribute);

        if ($value instanceof $enumClass) {
            return $value;
        }

        return $enumClass::from((string) $value);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => OrderStatus::class,
            'payment_status' => PaymentStatus::class,
            'total' => 'integer',
        ];
    }
}
