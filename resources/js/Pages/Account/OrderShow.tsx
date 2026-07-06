import { formatPrice } from '@/Hooks/useFormatPrice';
import ShopLayout from '@/Layouts/ShopLayout';
import { PageProps } from '@/types';
import { AccountOrderShowPageProps } from '@/types/shop';
import { Head, Link } from '@inertiajs/react';

function formatOrderDate(isoDate: string): string {
    return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'long',
        timeStyle: 'short',
    }).format(new Date(isoDate));
}

function statusLabel(status: string): string {
    switch (status) {
        case 'paid':
            return 'Paid';
        case 'pending':
            return 'Pending';
        case 'cancelled':
            return 'Cancelled';
        case 'refunded':
            return 'Refunded';
        default:
            return status;
    }
}

function statusClasses(status: string): string {
    switch (status) {
        case 'paid':
            return 'bg-emerald-50 text-emerald-700 ring-emerald-100';
        case 'pending':
            return 'bg-amber-50 text-amber-700 ring-amber-100';
        case 'cancelled':
            return 'bg-stone-100 text-stone-600 ring-stone-200';
        case 'refunded':
            return 'bg-indigo-50 text-indigo-700 ring-indigo-100';
        default:
            return 'bg-stone-100 text-stone-600 ring-stone-200';
    }
}

export default function OrderShow({ order }: PageProps<AccountOrderShowPageProps>) {
    return (
        <ShopLayout>
            <Head title={`Order #${order.number}`} />

            <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
                <Link
                    href={route('account.orders.index')}
                    className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition hover:text-stone-900 focus:outline-none focus-visible:text-indigo-600"
                >
                    <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        aria-hidden
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                        />
                    </svg>
                    Back to orders
                </Link>

                <div className="mt-6 rounded-2xl border border-stone-200/80 bg-white p-6 shadow-[0_4px_20px_-2px_rgb(0_0_0_/_0.08)] sm:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <h1 className="font-display text-2xl font-bold text-stone-900 sm:text-3xl">
                                Order #{order.number}
                            </h1>
                            <p className="mt-2 text-sm text-stone-600">
                                Placed on {formatOrderDate(order.placedAt)}
                            </p>
                            <p className="mt-1 text-sm text-stone-500">
                                Receipt sent to{' '}
                                <span className="font-medium text-stone-700">
                                    {order.email}
                                </span>
                            </p>
                        </div>
                        <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusClasses(order.status)}`}
                        >
                            {statusLabel(order.status)}
                        </span>
                    </div>

                    <div className="mt-8 rounded-xl border border-stone-100 bg-stone-50/80 p-5 sm:p-6">
                        <h2 className="font-display text-base font-semibold text-stone-900">
                            Items
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
                            <span className="text-sm font-medium text-stone-600">
                                Total
                            </span>
                            <span className="font-display text-lg font-bold text-stone-900">
                                {formatPrice(order.total)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
}
