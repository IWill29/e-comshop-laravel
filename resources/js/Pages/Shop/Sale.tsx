import ShopCatalog from '@/Components/Shop/ShopCatalog';
import ShopLayout from '@/Layouts/ShopLayout';
import { PageProps } from '@/types';
import { ShopIndexPageProps } from '@/types/shop';
import { Head } from '@inertiajs/react';

export default function ShopSale({
    products,
    filters,
    filterOptions,
    categories,
    pageTitle,
    pageSubtitle,
}: PageProps<ShopIndexPageProps>) {
    const title = pageTitle ?? 'Sale';
    const subtitle =
        pageSubtitle ??
        `${products.meta.total} ${products.meta.total === 1 ? 'style' : 'styles'} on sale`;

    return (
        <ShopLayout>
            <Head title={title} />
            <ShopCatalog
                title={title}
                subtitle={subtitle}
                baseUrl={route('shop.sale')}
                category={null}
                products={products}
                filters={filters}
                filterOptions={filterOptions}
                categories={categories}
            />
        </ShopLayout>
    );
}
