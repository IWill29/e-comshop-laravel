import InputError from '@/Components/InputError';
import { formatPrice } from '@/Hooks/useFormatPrice';
import ShopLayout from '@/Layouts/ShopLayout';
import { handleImageError } from '@/lib/image';
import { PageProps } from '@/types';
import { CheckoutIndexPageProps } from '@/types/shop';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const inputClassName =
    'mt-1.5 block w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/20';

const labelClassName = 'block text-sm font-medium text-stone-700';

const countries = [
    { code: 'US', label: 'United States' },
    { code: 'GB', label: 'United Kingdom' },
    { code: 'CA', label: 'Canada' },
    { code: 'DE', label: 'Germany' },
    { code: 'FR', label: 'France' },
    { code: 'LV', label: 'Latvia' },
];

export default function CheckoutIndex({
    items,
    summary,
    defaults,
}: PageProps<CheckoutIndexPageProps>) {
    const { data, setData, post, processing, errors } = useForm({
        email: defaults.email,
        name: defaults.name,
        line1: defaults.line1,
        line2: defaults.line2,
        city: defaults.city,
        state: defaults.state,
        postalCode: defaults.postalCode,
        country: defaults.country || 'US',
    });

    const hasItems = items.length > 0;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('checkout.store'));
    };

    return (
        <ShopLayout>
            <Head title="Checkout" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
                <nav className="text-sm text-stone-500" aria-label="Breadcrumb">
                    <ol className="flex flex-wrap items-center gap-1.5">
                        <li>
                            <Link href={route('home')} className="hover:text-stone-900">
                                Home
                            </Link>
                        </li>
                        <li aria-hidden className="text-stone-300">
                            /
                        </li>
                        <li>
                            <Link href="/cart" className="hover:text-stone-900">
                                Cart
                            </Link>
                        </li>
                        <li aria-hidden className="text-stone-300">
                            /
                        </li>
                        <li>
                            <span className="font-medium text-stone-900">Checkout</span>
                        </li>
                    </ol>
                </nav>

                <div className="mt-6 flex flex-col gap-2 sm:mt-8">
                    <h1 className="font-display text-2xl font-bold text-stone-900 sm:text-3xl">
                        Checkout
                    </h1>
                    <p className="max-w-2xl text-sm text-stone-600 sm:text-base">
                        Enter your details and continue to secure payment with Stripe.
                    </p>
                </div>

                {!hasItems ? (
                    <div className="mt-10 rounded-2xl border border-stone-200/80 bg-white p-8 text-center shadow-[0_4px_20px_-2px_rgb(0_0_0_/_0.08)] sm:p-12">
                        {errors.cart && (
                            <div
                                className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-left"
                                role="alert"
                            >
                                <InputError message={errors.cart} />
                            </div>
                        )}
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-500">
                            <svg
                                className="h-7 w-7"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                aria-hidden
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                                />
                            </svg>
                        </div>
                        <h2 className="mt-5 font-display text-xl font-semibold text-stone-900">
                            Your cart is empty
                        </h2>
                        <p className="mt-2 text-sm text-stone-600">
                            Add a pair (or two) before checking out.
                        </p>
                        <Link
                            href={route('shop.index')}
                            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 motion-reduce:hover:translate-y-0"
                        >
                            Browse shop
                        </Link>
                    </div>
                ) : (
                    <form
                        onSubmit={submit}
                        className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start lg:gap-10"
                    >
                        {errors.cart && (
                            <div
                                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 lg:col-span-2"
                                role="alert"
                            >
                                <InputError message={errors.cart} />
                            </div>
                        )}

                        <div className="space-y-8">
                            <section className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-[0_4px_20px_-2px_rgb(0_0_0_/_0.08)] sm:p-8">
                                <h2 className="font-display text-lg font-semibold text-stone-900">
                                    Contact
                                </h2>
                                <div className="mt-5">
                                    <label htmlFor="email" className={labelClassName}>
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        required
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className={inputClassName}
                                        placeholder="you@example.com"
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                    <p className="mt-2 text-xs text-stone-500">
                                        Order confirmation will be sent here.
                                    </p>
                                </div>
                            </section>

                            <section className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-[0_4px_20px_-2px_rgb(0_0_0_/_0.08)] sm:p-8">
                                <h2 className="font-display text-lg font-semibold text-stone-900">
                                    Shipping address
                                </h2>
                                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <label htmlFor="name" className={labelClassName}>
                                            Full name
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            name="name"
                                            autoComplete="name"
                                            required
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className={inputClassName}
                                        />
                                        <InputError message={errors.name} className="mt-2" />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label htmlFor="line1" className={labelClassName}>
                                            Address line 1
                                        </label>
                                        <input
                                            id="line1"
                                            type="text"
                                            name="line1"
                                            autoComplete="address-line1"
                                            required
                                            value={data.line1}
                                            onChange={(e) => setData('line1', e.target.value)}
                                            className={inputClassName}
                                        />
                                        <InputError message={errors.line1} className="mt-2" />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label htmlFor="line2" className={labelClassName}>
                                            Address line 2{' '}
                                            <span className="font-normal text-stone-400">
                                                (optional)
                                            </span>
                                        </label>
                                        <input
                                            id="line2"
                                            type="text"
                                            name="line2"
                                            autoComplete="address-line2"
                                            value={data.line2}
                                            onChange={(e) => setData('line2', e.target.value)}
                                            className={inputClassName}
                                        />
                                        <InputError message={errors.line2} className="mt-2" />
                                    </div>

                                    <div>
                                        <label htmlFor="city" className={labelClassName}>
                                            City
                                        </label>
                                        <input
                                            id="city"
                                            type="text"
                                            name="city"
                                            autoComplete="address-level2"
                                            required
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            className={inputClassName}
                                        />
                                        <InputError message={errors.city} className="mt-2" />
                                    </div>

                                    <div>
                                        <label htmlFor="state" className={labelClassName}>
                                            State / region
                                        </label>
                                        <input
                                            id="state"
                                            type="text"
                                            name="state"
                                            autoComplete="address-level1"
                                            required
                                            value={data.state}
                                            onChange={(e) => setData('state', e.target.value)}
                                            className={inputClassName}
                                        />
                                        <InputError message={errors.state} className="mt-2" />
                                    </div>

                                    <div>
                                        <label htmlFor="postalCode" className={labelClassName}>
                                            Postal code
                                        </label>
                                        <input
                                            id="postalCode"
                                            type="text"
                                            name="postalCode"
                                            autoComplete="postal-code"
                                            required
                                            value={data.postalCode}
                                            onChange={(e) =>
                                                setData('postalCode', e.target.value)
                                            }
                                            className={inputClassName}
                                        />
                                        <InputError message={errors.postalCode} className="mt-2" />
                                    </div>

                                    <div>
                                        <label htmlFor="country" className={labelClassName}>
                                            Country
                                        </label>
                                        <select
                                            id="country"
                                            name="country"
                                            required
                                            value={data.country}
                                            onChange={(e) => setData('country', e.target.value)}
                                            className={inputClassName}
                                        >
                                            {countries.map((country) => (
                                                <option key={country.code} value={country.code}>
                                                    {country.label}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.country} className="mt-2" />
                                    </div>
                                </div>
                            </section>
                        </div>

                        <aside className="lg:sticky lg:top-24">
                            <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-[0_4px_20px_-2px_rgb(0_0_0_/_0.08)] sm:p-8">
                                <h2 className="font-display text-lg font-semibold text-stone-900">
                                    Order summary
                                </h2>

                                <ul className="mt-5 divide-y divide-stone-100">
                                    {items.map((item) => (
                                        <li key={item.key} className="flex gap-4 py-4 first:pt-0">
                                            <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-stone-100 ring-1 ring-stone-200/60">
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    className="h-full w-full object-cover"
                                                    onError={handleImageError}
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                                                    {item.brand}
                                                </p>
                                                <p className="mt-0.5 truncate text-sm font-medium text-stone-900">
                                                    {item.name}
                                                </p>
                                                <p className="mt-1 text-xs text-stone-500">
                                                    Size {item.size} · Qty {item.quantity}
                                                </p>
                                                <p className="mt-2 text-sm font-semibold text-stone-900">
                                                    {formatPrice(item.unitPrice * item.quantity)}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                <dl className="mt-4 space-y-3 border-t border-stone-100 pt-4 text-sm">
                                    <div className="flex items-center justify-between text-stone-600">
                                        <dt>Subtotal</dt>
                                        <dd className="font-medium text-stone-900">
                                            {formatPrice(summary.subtotal)}
                                        </dd>
                                    </div>
                                    <div className="flex items-center justify-between text-stone-600">
                                        <dt>Shipping</dt>
                                        <dd className="font-medium text-stone-900">
                                            {summary.shipping === 0
                                                ? 'Free'
                                                : formatPrice(summary.shipping)}
                                        </dd>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-stone-100 pt-3 text-base">
                                        <dt className="font-semibold text-stone-900">Total</dt>
                                        <dd className="font-display text-xl font-bold text-stone-900">
                                            {formatPrice(summary.total)}
                                        </dd>
                                    </div>
                                </dl>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 motion-reduce:hover:translate-y-0"
                                >
                                    {processing ? 'Redirecting…' : 'Pay with Stripe'}
                                    {!processing && (
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
                                                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                                            />
                                        </svg>
                                    )}
                                </button>

                                <p className="mt-4 text-center text-xs leading-relaxed text-stone-500">
                                    Secure checkout powered by Stripe. You will be redirected to
                                    complete payment.
                                </p>
                            </div>
                        </aside>
                    </form>
                )}
            </div>
        </ShopLayout>
    );
}
