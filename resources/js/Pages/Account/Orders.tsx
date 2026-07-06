import OrderStatusBadge from '@/Components/Account/OrderStatusBadge';
import { formatPrice } from '@/Hooks/useFormatPrice';
import ShopLayout from '@/Layouts/ShopLayout';
import { PageProps } from '@/types';
import { AccountOrdersPageProps } from '@/types/shop';
import { formatOrderDate } from '@/Utils/orderDisplay';
import { Head, Link } from '@inertiajs/react';

export default function Orders({ orders }: PageProps<AccountOrdersPageProps>) {
    return (
        <ShopLayout>
            <Head title="My orders" />

            <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
                <div className="mb-8">
                    <h1 className="font-display text-3xl font-extrabold tracking-tight text-stone-900">
                        My orders
                    </h1>
                    <p className="mt-2 text-sm text-stone-600 sm:text-base">
                        Track your purchases and order status.
                    </p>
                </div>

                {orders.data.length === 0 ? (
                    <div className="rounded-2xl border border-stone-200/80 bg-white p-8 text-center shadow-[0_4px_20px_-2px_rgb(0_0_0_/_0.08)] sm:p-12">
                        <p className="text-sm text-stone-600 sm:text-base">
                            You have not placed any orders yet.
                        </p>
                        <Link
                            href={route('shop.index')}
                            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white shadow-sm transition-[transform,background-color,box-shadow] duration-[160ms] ease-out hover:bg-indigo-500 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 active:scale-[0.97] motion-reduce:active:scale-100"
                        >
                            Start shopping
                        </Link>
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {orders.data.map((order) => (
                            <li key={order.id}>
                                <Link
                                    href={route('account.orders.show', order.id)}
                                    className="group block rounded-2xl border border-stone-200/80 bg-white p-5 shadow-[0_4px_20px_-2px_rgb(0_0_0_/_0.08)] transition-[transform,box-shadow,border-color] duration-[160ms] ease-out hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 motion-reduce:hover:translate-y-0 sm:p-6"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <p className="font-display text-lg font-bold text-stone-900">
                                                Order #{order.number}
                                            </p>
                                            <p className="mt-1 text-sm text-stone-500">
                                                {formatOrderDate(order.placedAt)}
                                            </p>
                                        </div>
                                        <OrderStatusBadge status={order.status} />
                                    </div>

                                    <div className="mt-4 flex items-center justify-between gap-4 border-t border-stone-100 pt-4">
                                        <p className="text-sm text-stone-600">
                                            {order.itemCount}{' '}
                                            {order.itemCount === 1 ? 'item' : 'items'}
                                        </p>
                                        <p className="text-sm font-semibold text-stone-900">
                                            {formatPrice(order.total)}
                                        </p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}

                {orders.links.prev || orders.links.next ? (
                    <div className="mt-8 flex items-center justify-between gap-4">
                        {orders.links.prev ? (
                            <Link
                                href={orders.links.prev}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                preserveScroll
                            >
                                Previous
                            </Link>
                        ) : (
                            <span />
                        )}
                        {orders.links.next && (
                            <Link
                                href={orders.links.next}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                preserveScroll
                            >
                                Next
                            </Link>
                        )}
                    </div>
                ) : null}
            </div>
        </ShopLayout>
    );
}
