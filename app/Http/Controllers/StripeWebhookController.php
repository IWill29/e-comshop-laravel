<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\HandleStripeWebhookAction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Stripe\Exception\SignatureVerificationException;
use UnexpectedValueException;

class StripeWebhookController extends Controller
{
    public function __invoke(Request $request, HandleStripeWebhookAction $handleStripeWebhook): JsonResponse
    {
        $signature = $request->header('Stripe-Signature');

        if (! is_string($signature) || $signature === '') {
            return response()->json(['error' => 'Missing Stripe signature.'], 400);
        }

        try {
            $handleStripeWebhook->handle($request->getContent(), $signature);
        } catch (SignatureVerificationException) {
            return response()->json(['error' => 'Invalid Stripe signature.'], 400);
        } catch (UnexpectedValueException) {
            return response()->json(['error' => 'Invalid Stripe payload.'], 400);
        }

        return response()->json(['received' => true]);
    }
}
