import { Category } from '@/types/shop';
import { FALLBACK_SHOE_IMAGE, handleImageError } from '@/lib/image';
import { Link } from '@inertiajs/react';

const categoryImages: Record<string, string> = {
    mens: 'https://images.unsplash.com/photo-1600185365926-3a8ce9cbad2a?w=600&q=80',
    womens: 'https://images.unsplash.com/photo-1560769629-975ec94d6a86?w=600&q=80',
    kids: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=600&q=80',
    sneakers: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    boots: 'https://images.unsplash.com/photo-1608256246330-53e6090a2b9a?w=600&q=80',
    sandals: 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=600&q=80',
    running: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    casual: 'https://images.unsplash.com/photo-1608231388042-1630b4e282a9?w=600&q=80',
};

interface CategoryTileProps {
    category: Category;
}

export default function CategoryTile({ category }: CategoryTileProps) {
    const image = categoryImages[category.slug] ?? FALLBACK_SHOE_IMAGE;

    return (
        <Link
            href={`/shop/${category.slug}`}
            className="group relative w-[9.5rem] shrink-0 snap-start rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 xs:w-40 sm:w-48"
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
