import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export type AuthLayoutProps = PropsWithChildren<{
    title: string;
    subtitle?: string;
    alternate?: {
        prompt: string;
        linkLabel: string;
        href: string;
    };
}>;

const trustPoints = [
    'Free returns within 30 days',
    'Fast delivery across Europe',
    'Secure checkout with Stripe',
];

export default function AuthLayout({
    title,
    subtitle,
    alternate,
    children,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen bg-stone-50">
            {/* Brand panel — desktop */}
            <aside
                className="relative hidden overflow-hidden bg-stone-950 lg:flex lg:w-[44%] xl:w-[42%]"
                aria-hidden={false}
            >
                <div
                    className="pointer-events-none absolute -right-1/4 top-0 h-full w-[90%] bg-[radial-gradient(closest-side,rgba(99,102,241,0.4),transparent)]"
                    aria-hidden
                />
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    }}
                    aria-hidden
                />

                <div className="relative flex flex-col justify-between p-10 xl:p-14">
                    <div>
                        <Link
                            href={route('home')}
                            className="inline-block rounded-lg font-display text-2xl font-bold tracking-tight text-white transition hover:text-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
                        >
                            Paradit<span className="text-indigo-400">X</span>
                        </Link>
                    </div>

                    <div className="max-w-md">
                        <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
                            Member access
                        </p>
                        <h2 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white xl:text-5xl">
                            Step back into
                            <br />
                            <span className="bg-gradient-to-r from-indigo-300 via-indigo-400 to-white bg-clip-text text-transparent">
                                your stride
                            </span>
                        </h2>
                        <p className="mt-4 text-base leading-relaxed text-stone-400">
                            Track orders, save favorites, and check out faster on
                            your next pair.
                        </p>

                        <ul className="mt-8 space-y-3">
                            {trustPoints.map((point) => (
                                <li
                                    key={point}
                                    className="flex items-center gap-3 text-sm text-stone-300"
                                >
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
                                        <svg
                                            className="h-3 w-3"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2.5}
                                            stroke="currentColor"
                                            aria-hidden
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="m4.5 12.75 6 6 9-13.5"
                                            />
                                        </svg>
                                    </span>
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <p className="text-xs text-stone-600">
                        &copy; {new Date().getFullYear()} ParaditX. All rights reserved.
                    </p>
                </div>
            </aside>

            {/* Form panel */}
            <main className="flex flex-1 flex-col">
                <header className="safe-top flex items-center justify-between gap-4 border-b border-stone-200/80 bg-stone-50/90 px-4 py-4 backdrop-blur-md sm:px-6 lg:border-b-0 lg:px-10 lg:py-8">
                    <Link
                        href={route('home')}
                        className="inline-flex items-center gap-2 rounded-lg text-sm font-medium text-stone-500 transition hover:text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
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
                        Back to shop
                    </Link>

                    {alternate && (
                        <p className="text-sm text-stone-500 lg:hidden">
                            {alternate.prompt}{' '}
                            <Link
                                href={alternate.href}
                                className="font-semibold text-indigo-600 transition hover:text-indigo-500 focus:outline-none focus-visible:underline"
                            >
                                {alternate.linkLabel}
                            </Link>
                        </p>
                    )}

                    <Link
                        href={route('home')}
                        className="font-display text-lg font-bold tracking-tight text-stone-900 lg:hidden"
                    >
                        Paradit<span className="text-indigo-600">X</span>
                    </Link>
                </header>

                <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
                    <div className="w-full max-w-md">
                        <div className="auth-enter" style={{ animationDelay: '0ms' }}>
                            <h1 className="font-display text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
                                {title}
                            </h1>
                            {subtitle && (
                                <p className="mt-2 text-base leading-relaxed text-stone-500">
                                    {subtitle}
                                </p>
                            )}
                        </div>

                        <div className="mt-8">{children}</div>

                        {alternate && (
                            <p
                                className="auth-enter mt-8 hidden text-center text-sm text-stone-500 lg:block"
                                style={{ animationDelay: '200ms' }}
                            >
                                {alternate.prompt}{' '}
                                <Link
                                    href={alternate.href}
                                    className="font-semibold text-indigo-600 transition hover:text-indigo-500 focus:outline-none focus-visible:underline"
                                >
                                    {alternate.linkLabel}
                                </Link>
                            </p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
