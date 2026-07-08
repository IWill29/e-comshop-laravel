import { Category } from '@/types/shop';
import { FALLBACK_SHOE_IMAGE, handleImageError } from '@/lib/image';
import { Link } from '@inertiajs/react';

interface CategoryTileProps {
    category: Category;
}

export default function CategoryTile({ category }: Readonly<CategoryTileProps>) {
    const image = category.imageUrl || FALLBACK_SHOE_IMAGE;

    return (
        <Link
            href={`/shop/${category.slug}`}
            className="group relative w-[8.75rem] shrink-0 snap-start rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 xs:w-40 sm:w-44 md:w-48"
        >
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl ring-1 ring-black/5 sm:rounded-2xl">
                <img
                    src={image}
                    alt={category.name}
                    loading="lazy"
                    onError={handleImageError}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 sm:p-4">
                    <div className="min-w-0">
                        <h3 className="line-clamp-2 font-display text-sm font-bold leading-tight text-white sm:text-base md:text-lg">
                            {category.name}
                        </h3>
                        {category.productCount !== undefined && (
                            <p className="mt-0.5 text-[11px] text-white/70 sm:text-xs">
                                {category.productCount}{' '}
                                {category.productCount === 1 ? 'style' : 'styles'}
                            </p>
                        )}
                    </div>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition duration-300 sm:h-8 sm:w-8 sm:opacity-0 sm:group-hover:opacity-100">
                        <svg
                            className="h-3.5 w-3.5 sm:h-4 sm:w-4"
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
                    </span>
                </div>
            </div>
        </Link>
    );
}
