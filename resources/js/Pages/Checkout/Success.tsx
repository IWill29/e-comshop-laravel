import { formatPrice } from '@/Hooks/useFormatPrice';
import ShopLayout from '@/Layouts/ShopLayout';
import { PageProps } from '@/types';
import { CheckoutSuccessPageProps } from '@/types/shop';
import { Head, Link } from '@inertiajs/react';

function formatOrderDate(isoDate: string): string {
    return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'long',
        timeStyle: 'short',
    }).format(new Date(isoDate));
}

export default function CheckoutSuccess({ order }: PageProps<CheckoutSuccessPageProps>) {
    return (
        <ShopLayout>
            <Head title="Order confirmed" />

            <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
                <div className="rounded-2xl border border-stone-200/80 bg-white p-8 text-center shadow-[0_4px_20px_-2px_rgb(0_0_0_/_0.08)] sm:p-12">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
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
                                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                        </svg>
                    </div>

                    <h1 className="mt-6 font-display text-2xl font-bold text-stone-900 sm:text-3xl">
                        Thank you for your order
                    </h1>

                    {order ? (
                        <>
                            <p className="mt-3 text-sm text-stone-600 sm:text-base">
                                Order{' '}
                                <span className="font-semibold text-stone-900">
                                    #{order.number}
                                </span>{' '}
                                is confirmed. A receipt was sent to{' '}
                                <span className="font-medium text-stone-900">{order.email}</span>.
                            </p>
                            <p className="mt-1 text-xs text-stone-500 sm:text-sm">
                                Placed on {formatOrderDate(order.placedAt)}
                            </p>

                            <div className="mt-8 rounded-xl border border-stone-100 bg-stone-50/80 p-5 text-left sm:p-6">
                                <h2 className="font-display text-base font-semibold text-stone-900">
                                    Order summary
                                </h2>
                                <ul className="mt-4 divide-y divide-stone-200/70">
                                    {order.items.map((item, index) => (
                                        <li
                                            key={`${item.productName}-${item.size}-${index}`}
                                            className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
                                        >
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-stone-900">
                                                    {item.productName}
                                                </p>
                                                <p className="mt-0.5 text-xs text-stone-500">
                                                    {item.size !== null
                                                        ? `Size ${item.size} · `
                                                        : ''}
                                                    Qty {item.quantity}
                                                </p>
                                            </div>
                                            <p className="shrink-0 text-sm font-semibold text-stone-900">
                                                {formatPrice(item.unitPrice * item.quantity)}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-4 flex items-center justify-between border-t border-stone-200/70 pt-4">
                                    <span className="text-sm font-semibold text-stone-900">
                                        Total paid
                                    </span>
                                    <span className="font-display text-lg font-bold text-stone-900">
                                        {formatPrice(order.total)}
                                    </span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="mt-3 text-sm text-stone-600 sm:text-base">
                            Your payment was received. If you do not see order details here,
                            check your email for confirmation.
                        </p>
                    )}

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Link
                            href={route('shop.index')}
                            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 motion-reduce:hover:translate-y-0"
                        >
                            Continue shopping
                        </Link>
                        <Link
                            href="/cart"
                            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-stone-200 bg-white px-6 text-sm font-semibold text-stone-700 transition hover:border-stone-300 hover:bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                        >
                            Back to cart
                        </Link>
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
}
