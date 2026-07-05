import SizeSelector, { useSizeSelection } from '@/Components/Shop/SizeSelector';
import ShopLayout from '@/Layouts/ShopLayout';
import { formatPrice } from '@/Hooks/useFormatPrice';
import { handleImageError } from '@/lib/image';
import { PageProps } from '@/types';
import { ProductShowPageProps } from '@/types/shop';
import { Head, Link } from '@inertiajs/react';

export default function ProductShow({ product }: PageProps<ProductShowPageProps>) {
    const { selectedSize, setSelectedSize, isValid } = useSizeSelection(product.sizes);
    const price = formatPrice(product.price);
    const compareAtPrice = product.compareAtPrice
        ? formatPrice(product.compareAtPrice)
        : null;
    const onSale =
        product.compareAtPrice !== null && product.compareAtPrice > product.price;

    return (
        <ShopLayout>
            <Head title={product.name} />

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
                            <Link href={route('shop.index')} className="hover:text-stone-900">
                                Shop
                            </Link>
                        </li>
                        {product.category && (
                            <>
                                <li aria-hidden className="text-stone-300">
                                    /
                                </li>
                                <li>
                                    <Link
                                        href={route('shop.category', product.category.slug)}
                                        className="hover:text-stone-900"
                                    >
                                        {product.category.name}
                                    </Link>
                                </li>
                            </>
                        )}
                        <li aria-hidden className="text-stone-300">
                            /
                        </li>
                        <li>
                            <span className="font-medium text-stone-900">{product.name}</span>
                        </li>
                    </ol>
                </nav>

                <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-stone-100 shadow-[0_4px_20px_-2px_rgb(0_0_0_/_0.08)] ring-1 ring-stone-200/60">
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover"
                            onError={handleImageError}
                        />
                        {onSale && (
                            <span className="absolute left-4 top-4 rounded-full bg-orange-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                                Sale
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">
                            {product.brand}
                        </p>
                        <h1 className="mt-2 font-display text-2xl font-bold text-stone-900 sm:text-3xl md:text-4xl">
                            {product.name}
                        </h1>
                        <p className="mt-2 text-sm text-stone-600">
                            {product.color} · {product.gender}
                            {product.category ? ` · ${product.category.name}` : ''}
                        </p>

                        <div className="mt-6 flex flex-wrap items-baseline gap-3">
                            <span className="text-2xl font-bold text-stone-900">{price}</span>
                            {onSale && compareAtPrice && (
                                <span className="text-lg text-stone-400 line-through">
                                    {compareAtPrice}
                                </span>
                            )}
                        </div>

                        {product.description && (
                            <p className="mt-6 text-sm leading-relaxed text-stone-600 sm:text-base">
                                {product.description}
                            </p>
                        )}

                        <div className="mt-8">
                            <SizeSelector
                                sizes={product.sizes}
                                selectedSize={selectedSize}
                                onSelect={setSelectedSize}
                            />
                        </div>

                        <p className="mt-3 text-xs text-stone-500">
                            {product.stock > 0
                                ? `${product.stock} pairs in stock · SKU ${product.sku}`
                                : 'Out of stock'}
                        </p>

                        <button
                            type="button"
                            disabled={!isValid || product.stock === 0}
                            className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 motion-reduce:hover:translate-y-0 sm:w-auto sm:min-w-[220px]"
                        >
                            Add to cart
                        </button>

                        {!isValid && product.stock > 0 && (
                            <p className="mt-2 text-xs text-stone-500">
                                Select a size to continue.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
}
