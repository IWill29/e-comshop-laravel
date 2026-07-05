import ShopLayout from '@/Layouts/ShopLayout';
import { PageProps } from '@/types';
import { CheckoutCancelPageProps } from '@/types/shop';
import { Head, Link } from '@inertiajs/react';

export default function CheckoutCancel({
    message,
}: PageProps<CheckoutCancelPageProps>) {
    return (
        <ShopLayout>
            <Head title="Payment cancelled" />

            <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
                <div className="rounded-2xl border border-stone-200/80 bg-white p-8 text-center shadow-[0_4px_20px_-2px_rgb(0_0_0_/_0.08)] sm:p-12">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-1 ring-amber-100">
                        <svg
                            className="h-8 w-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.75}
                            stroke="currentColor"
                            aria-hidden
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                            />
                        </svg>
                    </div>

                    <h1 className="mt-6 font-display text-2xl font-bold text-stone-900 sm:text-3xl">
                        Payment cancelled
                    </h1>
                    <p className="mt-3 text-sm text-stone-600 sm:text-base">
                        {message ??
                            'No charge was made. Your cart is still saved — pick up where you left off.'}
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Link
                            href="/cart"
                            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 motion-reduce:hover:translate-y-0"
                        >
                            Return to cart
                        </Link>
                        <Link
                            href={route('checkout.index')}
                            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-stone-200 bg-white px-6 text-sm font-semibold text-stone-700 transition hover:border-stone-300 hover:bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                        >
                            Try checkout again
                        </Link>
                    </div>

                    <p className="mt-6 text-xs text-stone-500">
                        Need help?{' '}
                        <Link href={route('shop.index')} className="font-medium text-indigo-600 hover:text-indigo-500">
                            Browse the shop
                        </Link>{' '}
                        or contact support before your items sell out.
                    </p>
                </div>
            </div>
        </ShopLayout>
    );
}
