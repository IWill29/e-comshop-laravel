import ShopCatalog from '@/Components/Shop/ShopCatalog';
import ShopLayout from '@/Layouts/ShopLayout';
import { PageProps } from '@/types';
import { ShopCollectionPageProps } from '@/types/shop';
import { Head } from '@inertiajs/react';

export default function NewArrivals({
    products,
    filters,
    filterOptions,
    categories,
}: PageProps<ShopCollectionPageProps>) {
    const baseUrl = route('shop.new-arrivals');
    const title = 'New arrivals';
    const subtitle = `${products.meta.total} fresh ${products.meta.total === 1 ? 'drop' : 'drops'} — the latest styles added to the catalog`;

    return (
        <ShopLayout>
            <Head title="New arrivals" />
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
                    { label: 'Shop', href: route('shop.index') },
                    { label: 'New arrivals' },
                ]}
                emptyTitle="No new arrivals yet"
                emptyDescription="Fresh styles land here first — check back soon."
                emptyActionHref={route('shop.index')}
                emptyActionLabel="Browse all shoes"
            />
        </ShopLayout>
    );
}
