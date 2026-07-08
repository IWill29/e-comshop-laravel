import SizeSelector, { useSizeSelection } from '@/Components/Shop/SizeSelector';
import InputError from '@/Components/InputError';
import ShopLayout from '@/Layouts/ShopLayout';
import { formatPrice } from '@/Hooks/useFormatPrice';
import { handleImageError } from '@/lib/image';
import { PageProps } from '@/types';
import { ProductShowPageProps } from '@/types/shop';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function ProductShow({ product }: PageProps<ProductShowPageProps>) {
    const { selectedSize, setSelectedSize, isValid } = useSizeSelection(product.sizes);
    const { errors } = usePage<PageProps & { errors: Partial<Record<'size' | 'quantity', string>> }>().props;
    const [processing, setProcessing] = useState(false);
    const [justAdded, setJustAdded] = useState(false);
    const price = formatPrice(product.price);
    const compareAtPrice = product.compareAtPrice
        ? formatPrice(product.compareAtPrice)
        : null;
    const onSale =
        product.compareAtPrice !== null && product.compareAtPrice > product.price;

    const addToCart = () => {
        if (selectedSize === null) {
            return;
        }

        setProcessing(true);
        setJustAdded(false);

        router.post(
            route('cart.store', product.slug),
            {
                size: selectedSize,
                quantity: 1,
            },
            {
                preserveScroll: true,
                onSuccess: () => setJustAdded(true),
                onFinish: () => setProcessing(false),
            },
        );
    };

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
                                onSelect={(size) => {
                                    setSelectedSize(size);
                                    setJustAdded(false);
                                }}
                            />
                        </div>

                        <p className="mt-3 text-xs text-stone-500">
                            {product.stock > 0
                                ? `${product.stock} pairs in stock · SKU ${product.sku}`
                                : 'Out of stock'}
                        </p>

                        <button
                            type="button"
                            onClick={addToCart}
                            disabled={!isValid || product.stock === 0 || processing}
                            className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 motion-reduce:hover:translate-y-0 sm:w-auto sm:min-w-[220px]"
                        >
                            {processing ? 'Adding…' : 'Add to cart'}
                        </button>

                        <InputError message={errors?.size ?? errors?.quantity} className="mt-2" />

                        {justAdded && (
                            <div
                                className="mt-4 flex flex-col gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                                role="status"
                            >
                                <p className="text-sm font-medium text-emerald-900">
                                    Added to cart — you can keep shopping.
                                </p>
                                <Link
                                    href={route('cart.index')}
                                    className="inline-flex min-h-9 shrink-0 items-center justify-center rounded-lg bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                                >
                                    View cart
                                </Link>
                            </div>
                        )}

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
