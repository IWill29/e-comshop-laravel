import ShopCatalog from '@/Components/Shop/ShopCatalog';
import ProductSearch from '@/Components/Shop/ProductSearch';
import ShopLayout from '@/Layouts/ShopLayout';
import { PageProps } from '@/types';
import { ShopCollectionPageProps } from '@/types/shop';
import { Head } from '@inertiajs/react';

export default function Search({
    products,
    filters,
    filterOptions,
    categories,
}: PageProps<ShopCollectionPageProps>) {
    const query = filters.query?.trim() ?? '';
    const baseUrl = route('shop.search');
    const hasQuery = query.length > 0;
    const title = hasQuery ? `Results for “${query}”` : 'Search';
    const subtitle = hasQuery
        ? `${products.meta.total} ${products.meta.total === 1 ? 'match' : 'matches'} for name, brand, or SKU`
        : 'Find shoes by name, brand, or SKU';

    return (
        <ShopLayout>
            <Head title={hasQuery ? `Search: ${query}` : 'Search'} />
            <ShopCatalog
                title={title}
                subtitle={subtitle}
                baseUrl={baseUrl}
                category={null}
                products={products}
                filters={filters}
                filterOptions={filterOptions}
                categories={categories}
                showCategories={false}
                breadcrumbs={[
                    { label: 'Home', href: route('home') },
                    { label: hasQuery ? 'Search results' : 'Search' },
                ]}
                emptyTitle={hasQuery ? `No results for “${query}”` : 'Start your search'}
                emptyDescription={
                    hasQuery
                        ? 'Try a different keyword or browse the full catalog.'
                        : 'Enter a shoe name, brand, or SKU to see matching styles.'
                }
                emptyActionHref={route('shop.index')}
                emptyActionLabel="Browse all shoes"
                headerExtra={
                    <ProductSearch
                        id="search-query"
                        defaultValue={query}
                        placeholder="Search by name, brand, or SKU…"
                        showSubmitButton
                        autoFocus={!hasQuery}
                        className="mt-4 max-w-xl"
                        inputClassName="min-h-11 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/20"
                    />
                }
            />
        </ShopLayout>
    );
}
