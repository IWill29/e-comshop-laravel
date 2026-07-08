import CategoryTile from '@/Components/CategoryTile';
import BrandTicker from '@/Components/BrandTicker';
import ProductCard from '@/Components/ProductCard';
import ShopLayout from '@/Layouts/ShopLayout';
import { handleImageError } from '@/lib/image';
import { HomePageProps } from '@/types/shop';
import { PageProps } from '@/types';
import { Head, Link, WhenVisible } from '@inertiajs/react';

const SKELETON_KEYS = ['sk-a', 'sk-b', 'sk-c', 'sk-d', 'sk-e', 'sk-f', 'sk-g', 'sk-h'] as const;

function ProductGridSkeleton({ count = 4 }: Readonly<{ count?: number }>) {
    return (
        <div className="mt-8 grid grid-cols-2 gap-3 min-[480px]:gap-4 sm:mt-10 sm:gap-5 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {SKELETON_KEYS.slice(0, count).map((key) => (
                <div
                    key={key}
                    className="animate-pulse overflow-hidden rounded-2xl bg-stone-200/80"
                >
                    <div className="aspect-[4/5] bg-stone-200" />
                    <div className="space-y-2 p-3">
                        <div className="h-3 w-2/3 rounded bg-stone-200" />
                        <div className="h-4 w-1/2 rounded bg-stone-200" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function Home({
    heroImageUrl,
    heroProduct,
    featuredProducts,
    newArrivals = [],
    categories,
}: Readonly<PageProps<HomePageProps>>) {
    return (
        <ShopLayout>
            <Head title="Shoes for every stride" />

            {/* Hero — dark stage */}
            <section className="relative overflow-x-clip bg-stone-950 text-white">
                <div
                    className="pointer-events-none absolute -right-1/4 top-0 h-[120%] w-[80%] bg-[radial-gradient(closest-side,rgba(99,102,241,0.35),transparent)]"
                    aria-hidden
                />
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    }}
                    aria-hidden
                />

                <div className="relative mx-auto grid max-w-7xl gap-8 px-4 pb-10 pt-12 sm:gap-10 sm:px-6 sm:pb-14 sm:pt-16 md:gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8 lg:px-8 lg:pb-20 lg:pt-24">
                    <div className="max-w-xl">
                        <p className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-indigo-300 sm:text-[11px] sm:tracking-[0.2em]">
                            <span className="truncate">Paradit X — Spring/Summer 26</span>
                        </p>
                        <h1 className="mt-4 font-display text-[2.25rem] font-extrabold leading-[0.95] tracking-tight xs:text-4xl sm:mt-6 sm:text-5xl md:text-6xl lg:text-7xl">
                            Shoes for
                            <br />
                            <span className="bg-gradient-to-r from-indigo-300 via-indigo-400 to-white bg-clip-text text-transparent">
                                every stride
                            </span>
                        </h1>
                        <p className="mt-4 max-w-md text-sm leading-relaxed text-stone-300 sm:mt-6 sm:text-base md:text-lg">
                            Sneakers, boots, and everyday pairs from the brands you
                            trust. Sized right, shipped fast, returned free within 30
                            days.
                        </p>
                        <div className="mt-6 flex flex-col gap-3 xs:flex-row xs:flex-wrap sm:mt-8">
                            <Link
                                href="/shop"
                                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:bg-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950 motion-reduce:hover:translate-y-0 xs:w-auto"
                            >
                                Browse collection
                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                                    />
                                </svg>
                            </Link>
                            <Link
                                href="/shop/sneakers"
                                className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:border-white/30 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950 xs:w-auto"
                            >
                                Shop sneakers
                            </Link>
                        </div>
                    </div>

                    {heroProduct && (
                        <div className="relative pb-10 sm:pb-12 lg:pb-0">
                            <div
                                className="absolute inset-x-4 bottom-12 top-10 rounded-[2rem] bg-indigo-500/20 blur-2xl motion-reduce:hidden sm:inset-x-6"
                                aria-hidden
                            />
                            <Link
                                href={`/products/${heroProduct.slug}`}
                                className="group relative block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-4 focus-visible:ring-offset-stone-950 sm:rounded-[2rem]"
                            >
                                <div className="overflow-hidden rounded-2xl bg-stone-900 ring-1 ring-white/10 transition duration-500 group-hover:-translate-y-2 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 sm:rounded-[2rem]">
                                    <img
                                        src={heroImageUrl ?? heroProduct.imageUrl}
                                        alt={heroProduct.name}
                                        width={1200}
                                        height={960}
                                        loading="eager"
                                        decoding="async"
                                        onError={handleImageError}
                                        fetchPriority="high"
                                        className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 sm:aspect-[5/4]"
                                    />
                                </div>
                                <div className="absolute -bottom-2 left-3 right-3 flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 text-stone-900 shadow-xl sm:-bottom-5 sm:left-5 sm:right-auto sm:rounded-2xl sm:px-4 sm:py-3">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 sm:h-9 sm:w-9">
                                        01
                                    </span>
                                    <div className="min-w-0 pr-1 sm:pr-2">
                                        <p className="truncate text-[10px] font-medium uppercase tracking-widest text-stone-500 sm:text-[11px]">
                                            {heroProduct.brand}
                                        </p>
                                        <p className="truncate font-display text-xs font-bold leading-tight sm:text-sm">
                                            {heroProduct.name}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )}
                </div>

                <BrandTicker />
            </section>

            {/* Categories runway */}
            <section className="border-b border-stone-200 bg-white py-10 sm:py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between gap-3">
                        <div className="min-w-0">
                            <h2 className="font-display text-xl font-bold text-stone-900 sm:text-2xl md:text-3xl">
                                Shop by category
                            </h2>
                            <p className="mt-1 text-sm text-stone-600">
                                Find your fit across every collection
                            </p>
                        </div>
                        <Link
                            href="/shop"
                            className="shrink-0 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                            View all
                        </Link>
                    </div>

                    <div className="mt-6 overflow-x-auto overscroll-x-contain pb-2 scroll-touch sm:mt-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <div className="flex w-max min-w-full gap-3 snap-x snap-mandatory sm:gap-4">
                            {categories.map((category) => (
                                <CategoryTile key={category.id} category={category} />
                            ))}
                            <span
                                className="w-4 shrink-0 snap-none sm:w-6"
                                aria-hidden="true"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured */}
            {featuredProducts.length > 0 && (
                <section className="py-12 sm:py-16 md:py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div>
                            <h2 className="font-display text-xl font-bold text-stone-900 sm:text-2xl md:text-3xl">
                                Featured picks
                            </h2>
                            <p className="mt-1 text-sm text-stone-600">
                                Hand-selected styles our customers love most
                            </p>
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-3 min-[480px]:gap-4 sm:mt-10 sm:gap-5 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
                            {featuredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* New arrivals — lazy load when scrolled near (Inertia WhenVisible) */}
            <WhenVisible
                data="newArrivals"
                buffer={600}
                fallback={
                    <section className="border-t border-stone-200 bg-stone-100/60 py-12 sm:py-16 md:py-20">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="flex items-end justify-between gap-3">
                                <div className="min-w-0">
                                    <h2 className="font-display text-xl font-bold text-stone-900 sm:text-2xl md:text-3xl">
                                        New arrivals
                                    </h2>
                                    <p className="mt-1 text-sm text-stone-600">
                                        Fresh drops, just landed
                                    </p>
                                </div>
                            </div>
                            <ProductGridSkeleton count={4} />
                        </div>
                    </section>
                }
            >
                {newArrivals.length > 0 && (
                    <section className="border-t border-stone-200 bg-stone-100/60 py-12 sm:py-16 md:py-20">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="flex items-end justify-between gap-3">
                                <div className="min-w-0">
                                    <h2 className="font-display text-xl font-bold text-stone-900 sm:text-2xl md:text-3xl">
                                        New arrivals
                                    </h2>
                                    <p className="mt-1 text-sm text-stone-600">
                                        Fresh drops, just landed
                                    </p>
                                </div>
                                <Link
                                    href="/new-arrivals"
                                    className="shrink-0 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                                >
                                    See all
                                </Link>
                            </div>

                            <div className="mt-8 grid grid-cols-2 gap-3 min-[480px]:gap-4 sm:mt-10 sm:gap-5 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
                                {newArrivals.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </WhenVisible>

            {/* CTA band */}
            <section className="relative overflow-x-clip bg-stone-950 py-12 sm:py-16 md:py-20">
                <div
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.35),transparent_60%)]"
                    aria-hidden
                />
                <div className="relative mx-auto flex max-w-7xl flex-col items-stretch gap-6 px-4 sm:px-6 md:items-center md:text-center lg:flex-row lg:items-center lg:justify-between lg:text-left lg:px-8">
                    <div className="min-w-0">
                        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                            Not sure about sizing?
                        </h2>
                        <p className="mt-3 max-w-lg text-sm text-stone-400 sm:text-base md:mx-auto lg:mx-0">
                            Every product page shows EU sizes with sold-out sizes
                            greyed out. Check the guide before you buy.
                        </p>
                    </div>
                    <Link
                        href="/size-guide"
                        className="inline-flex min-h-11 w-full shrink-0 items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-stone-900 transition hover:-translate-y-0.5 hover:bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950 motion-reduce:hover:translate-y-0 sm:w-auto"
                    >
                        Open size guide
                    </Link>
                </div>
            </section>
        </ShopLayout>
    );
}
