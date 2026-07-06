import ProductSearch from '@/Components/Shop/ProductSearch';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, useEffect, useState } from 'react';
import { PageProps } from '@/types';

const navLinks = [
    { label: 'Shop', href: '/shop' },
    { label: 'Men', href: '/shop/mens' },
    { label: 'Women', href: '/shop/womens' },
    { label: 'Sale', href: '/sale' },
    { label: 'New arrivals', href: '/new-arrivals' },
];

export default function ShopLayout({ children }: PropsWithChildren) {
    const { auth, cartCount } = usePage<PageProps>().props;
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileOpen]);

    return (
        <div className="flex min-h-screen flex-col bg-stone-50 text-stone-900">
            <header className="safe-top sticky top-0 z-50 border-b border-stone-200/80 bg-stone-50/90 backdrop-blur-md">
                <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:h-16 sm:gap-4 sm:px-6 lg:px-8">
                    <div className="flex min-w-0 items-center gap-4 sm:gap-8">
                        <Link
                            href={route('home')}
                            className="shrink-0 rounded-lg font-display text-lg font-bold tracking-tight text-stone-900 transition hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:text-xl"
                        >
                            Paradit<span className="text-indigo-600">X</span>
                        </Link>

                        <nav
                            className="hidden items-center gap-5 lg:flex"
                            aria-label="Main"
                        >
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="whitespace-nowrap text-sm font-medium text-stone-600 transition hover:text-stone-900 focus:outline-none focus-visible:text-indigo-600"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                        <ProductSearch
                            id="header-search"
                            placeholder="Search shoes…"
                            className="hidden w-40 md:block lg:w-52"
                            inputClassName="h-10 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/20"
                        />

                        <Link
                            href={route('cart.index')}
                            className="relative flex h-11 w-11 items-center justify-center rounded-xl text-stone-600 transition hover:bg-stone-100 hover:text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                            aria-label={cartCount > 0 ? `Cart, ${cartCount} items` : 'Cart'}
                        >
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                                />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </Link>

                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="hidden h-11 items-center rounded-xl px-4 text-sm font-medium text-stone-600 transition hover:bg-stone-100 hover:text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 md:inline-flex"
                            >
                                Account
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="hidden h-11 items-center rounded-xl px-4 text-sm font-medium text-stone-600 transition hover:bg-stone-100 hover:text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 md:inline-flex"
                            >
                                Sign in
                            </Link>
                        )}

                        <Link
                            href="/shop"
                            className="hidden h-11 items-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 motion-reduce:hover:translate-y-0 md:inline-flex"
                        >
                            Shop all
                        </Link>

                        <button
                            type="button"
                            className="flex h-11 w-11 items-center justify-center rounded-xl text-stone-600 transition hover:bg-stone-100 lg:hidden"
                            aria-expanded={mobileOpen}
                            aria-controls="mobile-nav"
                            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                            onClick={() => setMobileOpen((open) => !open)}
                        >
                            {mobileOpen ? (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {mobileOpen && (
                    <nav
                        id="mobile-nav"
                        className="safe-bottom max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-t border-stone-200 bg-stone-50 px-4 py-4 scroll-touch sm:max-h-[calc(100dvh-4rem)] lg:hidden"
                        aria-label="Mobile"
                    >
                        <div className="mb-4 px-1">
                            <ProductSearch
                                id="mobile-search"
                                placeholder="Search name, brand, SKU…"
                                className="w-full"
                            />
                        </div>
                        <ul className="space-y-1">
                            {navLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="flex min-h-11 items-center rounded-xl px-3 text-sm font-medium text-stone-700 hover:bg-stone-100"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                            <li className="pt-2">
                                <Link
                                    href="/shop"
                                    className="flex min-h-11 items-center justify-center rounded-xl bg-indigo-600 px-3 text-sm font-semibold text-white"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Shop all
                                </Link>
                            </li>
                            {!auth.user && (
                                <li>
                                    <Link
                                        href={route('login')}
                                        className="flex min-h-11 items-center rounded-xl px-3 text-sm font-medium text-stone-700 hover:bg-stone-100"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        Sign in
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </nav>
                )}
            </header>

            <main className="flex-1">{children}</main>

            <footer className="safe-bottom border-t border-stone-200 bg-stone-100">
                <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
                    <div className="grid grid-cols-2 gap-8 sm:gap-10 lg:grid-cols-4">
                        <div className="col-span-2 lg:col-span-1">
                            <Link
                                href={route('home')}
                                className="font-display text-lg font-bold text-stone-900"
                            >
                                Paradit<span className="text-indigo-600">X</span>
                            </Link>
                            <p className="mt-3 max-w-xs text-sm leading-relaxed text-stone-600">
                                Premium footwear for every stride. Sneakers, boots, and everyday classics — shipped fast, sized right.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-xs font-semibold uppercase tracking-widest text-stone-500">
                                Shop
                            </h4>
                            <ul className="mt-4 space-y-2.5 text-sm">
                                <li><Link href="/shop" className="inline-flex min-h-8 items-center text-stone-600 hover:text-stone-900">All shoes</Link></li>
                                <li><Link href="/shop/mens" className="inline-flex min-h-8 items-center text-stone-600 hover:text-stone-900">Men</Link></li>
                                <li><Link href="/shop/womens" className="inline-flex min-h-8 items-center text-stone-600 hover:text-stone-900">Women</Link></li>
                                <li><Link href="/shop/sneakers" className="inline-flex min-h-8 items-center text-stone-600 hover:text-stone-900">Sneakers</Link></li>
                                <li><Link href="/sale" className="inline-flex min-h-8 items-center text-stone-600 hover:text-stone-900">Sale</Link></li>
                                <li><Link href="/new-arrivals" className="inline-flex min-h-8 items-center text-stone-600 hover:text-stone-900">New arrivals</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xs font-semibold uppercase tracking-widest text-stone-500">
                                Help
                            </h4>
                            <ul className="mt-4 space-y-2.5 text-sm">
                                <li><Link href="/shipping-returns" className="inline-flex min-h-8 items-center text-stone-600 hover:text-stone-900">Shipping & returns</Link></li>
                                <li><Link href="/size-guide" className="inline-flex min-h-8 items-center text-stone-600 hover:text-stone-900">Size guide</Link></li>
                                <li><Link href="/contact" className="inline-flex min-h-8 items-center text-stone-600 hover:text-stone-900">Contact</Link></li>
                            </ul>
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <h4 className="text-xs font-semibold uppercase tracking-widest text-stone-500">
                                Account
                            </h4>
                            <ul className="mt-4 space-y-2.5 text-sm">
                                {auth.user ? (
                                    <li><Link href={route('dashboard')} className="inline-flex min-h-8 items-center text-stone-600 hover:text-stone-900">Dashboard</Link></li>
                                ) : (
                                    <>
                                        <li><Link href={route('login')} className="inline-flex min-h-8 items-center text-stone-600 hover:text-stone-900">Sign in</Link></li>
                                        <li><Link href={route('register')} className="inline-flex min-h-8 items-center text-stone-600 hover:text-stone-900">Create account</Link></li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-stone-200 pt-6 text-center sm:mt-10 sm:flex-row sm:pt-8 sm:text-left">
                        <p className="text-xs text-stone-500">
                            &copy; {new Date().getFullYear()} Paradit X. Secure checkout powered by Stripe.
                        </p>
                        <div className="flex gap-4 text-xs text-stone-500">
                            <Link href="/privacy" className="inline-flex min-h-8 items-center hover:text-stone-700">Privacy</Link>
                            <Link href="/terms" className="inline-flex min-h-8 items-center hover:text-stone-700">Terms</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
