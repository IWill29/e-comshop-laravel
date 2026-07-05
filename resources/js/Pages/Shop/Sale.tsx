import ShopCatalog from '@/Components/Shop/ShopCatalog';
import ShopLayout from '@/Layouts/ShopLayout';
import { PageProps } from '@/types';
import { ShopCollectionPageProps } from '@/types/shop';
import { Head } from '@inertiajs/react';

export default function Sale({
    products,
    filters,
    filterOptions,
    categories,
}: PageProps<ShopCollectionPageProps>) {
    const baseUrl = route('shop.sale');
    const title = 'Sale';
    const subtitle = `${products.meta.total} discounted ${products.meta.total === 1 ? 'style' : 'styles'} — limited-time markdowns`;

    return (
        <ShopLayout>
            <Head title="Sale" />
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
                    { label: 'Sale' },
                ]}
                emptyTitle="No sale items right now"
                emptyDescription="Check back soon — new markdowns drop regularly."
                emptyActionHref={route('shop.index')}
                emptyActionLabel="Browse all shoes"
            />
        </ShopLayout>
    );
}
