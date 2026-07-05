import { Product } from '@/types/shop';
import { formatPrice } from '@/Hooks/useFormatPrice';
import { handleImageError } from '@/lib/image';
import { Link } from '@inertiajs/react';

interface ProductCardProps {
    product: Product;
    priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
    const price = formatPrice(product.price);
    const compareAtPriceFormatted = product.compareAtPrice
        ? formatPrice(product.compareAtPrice)
        : null;
    const onSale =
        product.compareAtPrice !== null &&
        product.compareAtPrice > product.price;

    return (
        <article className="group relative min-w-0">
            <Link
                href={`/products/${product.slug}`}
                className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-stone-100 shadow-[0_4px_20px_-2px_rgb(0_0_0_/_0.08)] ring-1 ring-stone-200/60 transition duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_12px_40px_-8px_rgb(0_0_0_/_0.15)] sm:rounded-2xl">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        loading={priority ? 'eager' : 'lazy'}
                        onError={handleImageError}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />

                    {onSale && (
                        <span className="absolute left-2 top-2 rounded-full bg-orange-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[11px]">
                            Sale
                        </span>
                    )}

                    {/* Always visible on touch; hover reveal on desktop */}
                    <div className="absolute inset-x-2 bottom-2 flex translate-y-0 items-center justify-between rounded-lg bg-white/90 px-2.5 py-2 opacity-100 shadow-lg ring-1 ring-black/5 backdrop-blur transition duration-300 sm:inset-x-3 sm:bottom-3 sm:translate-y-2 sm:rounded-xl sm:px-3.5 sm:py-2.5 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
                        <span className="text-xs font-semibold text-stone-900 sm:text-sm">
                            View details
                        </span>
                        <svg
                            className="h-3.5 w-3.5 text-indigo-600 sm:h-4 sm:w-4"
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
                    </div>
                </div>

                <div className="mt-3 space-y-0.5 sm:mt-4 sm:space-y-1">
                    <p className="truncate text-[10px] font-semibold uppercase tracking-widest text-stone-500 sm:text-[11px]">
                        {product.brand}
                    </p>
                    <h3 className="line-clamp-2 font-display text-sm font-semibold leading-snug text-stone-900 transition group-hover:text-indigo-600 sm:text-base md:text-lg">
                        {product.name}
                    </h3>
                    <p className="truncate text-xs text-stone-500 sm:text-sm">
                        {product.color}
                    </p>
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 pt-0.5 sm:pt-1">
                        <span className="text-sm font-semibold text-stone-900 sm:text-base">
                            {price}
                        </span>
                        {onSale && compareAtPriceFormatted && (
                            <span className="text-xs text-stone-400 line-through sm:text-sm">
                                {compareAtPriceFormatted}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </article>
    );
}
