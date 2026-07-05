import ShopCatalog from '@/Components/Shop/ShopCatalog';
import ShopLayout from '@/Layouts/ShopLayout';
import { PageProps } from '@/types';
import { ShopSearchPageProps } from '@/types/shop';
import { Head, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

export default function ShopSearch({
    query,
    products,
    filters,
    filterOptions,
    categories,
    pageTitle,
    pageSubtitle,
}: PageProps<ShopSearchPageProps>) {
    const [term, setTerm] = useState(query);
    const title = pageTitle ?? (query ? `Search: ${query}` : 'Search');
    const subtitle =
        pageSubtitle ??
        (query
            ? `${products.meta.total} ${products.meta.total === 1 ? 'result' : 'results'} for “${query}”`
            : 'Find shoes by name, brand, or SKU');
    const preservedQueryParams: Record<string, string> = query ? { q: query } : {};

    const handleSearch = (event: FormEvent) => {
        event.preventDefault();
        const nextQuery = term.trim();

        router.get(
            route('shop.search'),
            nextQuery ? { q: nextQuery } : {},
            { preserveScroll: true, replace: true },
        );
    };

    return (
        <ShopLayout>
            <Head title={query ? `Search: ${query}` : 'Search'} />

            <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pt-12">
                <form
                    onSubmit={handleSearch}
                    className="flex flex-col gap-3 sm:flex-row sm:items-center"
                    role="search"
                >
                    <label htmlFor="shop-search" className="sr-only">
                        Search shoes
                    </label>
                    <input
                        id="shop-search"
                        type="search"
                        value={term}
                        onChange={(event) => setTerm(event.target.value)}
                        placeholder="Search by name, brand, or SKU"
                        className="min-h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-900 shadow-sm transition placeholder:text-stone-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <button
                        type="submit"
                        className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 motion-reduce:hover:translate-y-0 sm:min-w-[120px]"
                    >
                        Search
                    </button>
                </form>
            </div>

            {query ? (
                <ShopCatalog
                    title={title}
                    subtitle={subtitle}
                    baseUrl={route('shop.search')}
                    category={null}
                    products={products}
                    filters={filters}
                    filterOptions={filterOptions}
                    categories={categories}
                    preservedQueryParams={preservedQueryParams}
                />
            ) : (
                <div className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
                    <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center shadow-[0_4px_20px_-2px_rgb(0_0_0_/_0.06)]">
                        <p className="font-display text-lg font-semibold text-stone-900">
                            Start with a search term
                        </p>
                        <p className="mt-2 text-sm text-stone-600">
                            Try a brand like Nike, a style name, or a SKU.
                        </p>
                    </div>
                </div>
            )}
        </ShopLayout>
    );
}
