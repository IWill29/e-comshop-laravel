import CatalogPagination from '@/Components/Shop/CatalogPagination';
import FilterSidebar from '@/Components/Shop/FilterSidebar';
import ProductCard from '@/Components/ProductCard';
import {
    CatalogFilters,
    Category,
    FilterOptions,
    Paginated,
    Product,
} from '@/types/shop';
import { Link } from '@inertiajs/react';
import { ReactNode } from 'react';

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface ShopCatalogProps {
    title: string;
    subtitle: string;
    baseUrl: string;
    category: Category | null;
    products: Paginated<Product>;
    filters: CatalogFilters;
    filterOptions: FilterOptions;
    categories: Category[];
    breadcrumbs?: BreadcrumbItem[];
    showCategories?: boolean;
    emptyTitle?: string;
    emptyDescription?: string;
    emptyActionHref?: string;
    emptyActionLabel?: string;
    headerExtra?: ReactNode;
}

export default function ShopCatalog({
    title,
    subtitle,
    baseUrl,
    category,
    products,
    filters,
    filterOptions,
    categories,
    breadcrumbs,
    showCategories = true,
    emptyTitle = 'No shoes match these filters',
    emptyDescription = 'Try clearing a filter or browse another category.',
    emptyActionHref = route('shop.index'),
    emptyActionLabel = 'View all shoes',
    headerExtra,
}: Readonly<ShopCatalogProps>) {
    const isEmpty = products.data.length === 0;

    const defaultBreadcrumbs: BreadcrumbItem[] = [
        { label: 'Home', href: route('home') },
        {
            label: 'Shop',
            href: category ? route('shop.index') : undefined,
        },
        ...(category ? [{ label: category.name }] : []),
    ];

    const trail = breadcrumbs ?? defaultBreadcrumbs;

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
            <nav className="text-sm text-stone-500" aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center gap-1.5">
                    {trail.map((item, index) => (
                        <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
                            {index > 0 && (
                                <span aria-hidden className="text-stone-300">
                                    /
                                </span>
                            )}
                            {item.href ? (
                                <Link href={item.href} className="hover:text-stone-900">
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="font-medium text-stone-900">{item.label}</span>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>

            <div className="mt-4 flex flex-col gap-4 sm:mt-6 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                    <h1 className="font-display text-2xl font-bold text-stone-900 sm:text-3xl md:text-4xl">
                        {title}
                    </h1>
                    <p className="mt-1 text-sm text-stone-600 sm:text-base">{subtitle}</p>
                    {headerExtra}
                </div>
                <div className="lg:hidden">
                    <FilterSidebar
                        mode="mobile"
                        baseUrl={baseUrl}
                        filters={filters}
                        filterOptions={filterOptions}
                    />
                </div>
            </div>

            {!category && showCategories && categories.length > 0 && (
                <div className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 scroll-touch sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {categories.map((item) => (
                        <Link
                            key={item.id}
                            href={route('shop.category', item.slug)}
                            className="shrink-0 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-indigo-200 hover:text-indigo-600"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            )}

            <div className="mt-8 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
                <div className="hidden lg:block">
                    <FilterSidebar
                        mode="desktop"
                        baseUrl={baseUrl}
                        filters={filters}
                        filterOptions={filterOptions}
                    />
                </div>

                <div>
                    {isEmpty ? (
                        <div className="rounded-2xl border border-dashed border-stone-200 bg-white px-6 py-16 text-center">
                            <p className="font-display text-lg font-semibold text-stone-900">
                                {emptyTitle}
                            </p>
                            <p className="mt-2 text-sm text-stone-600">
                                {emptyDescription}
                            </p>
                            {emptyActionHref && (
                                <Link
                                    href={emptyActionHref}
                                    className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-500"
                                >
                                    {emptyActionLabel}
                                </Link>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-3 min-[480px]:gap-4 sm:gap-5 md:grid-cols-3 md:gap-6 xl:grid-cols-3">
                                {products.data.map((product, index) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        priority={index < 3}
                                    />
                                ))}
                            </div>
                            <CatalogPagination pagination={products} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
