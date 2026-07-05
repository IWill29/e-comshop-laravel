<?php

declare(strict_types=1);

namespace App\DTOs;

readonly class CheckoutData
{
    public function __construct(
        public string $email,
        public string $name,
        public string $line1,
        public ?string $line2,
        public string $city,
        public string $state,
        public string $postalCode,
        public string $country,
    ) {}

    /**
     * @param  array<string, mixed>  $validated
     */
    public static function fromValidated(array $validated): self
    {
        $line2 = $validated['line2'] ?? null;

        return new self(
            email: (string) $validated['email'],
            name: (string) $validated['name'],
            line1: (string) $validated['line1'],
            line2: is_string($line2) && $line2 !== '' ? $line2 : null,
            city: (string) $validated['city'],
            state: (string) $validated['state'],
            postalCode: (string) $validated['postalCode'],
            country: (string) $validated['country'],
        );
    }

    /**
     * @return array<string, string>
     */
    public function toStripeMetadata(int $orderId): array
    {
        return array_filter([
            'order_id' => (string) $orderId,
            'shipping_name' => $this->name,
            'shipping_line1' => $this->line1,
            'shipping_line2' => $this->line2,
            'shipping_city' => $this->city,
            'shipping_state' => $this->state,
            'shipping_postal_code' => $this->postalCode,
            'shipping_country' => $this->country,
        ], fn (?string $value): bool => $value !== null && $value !== '');
    }
}
