import ShopCatalog from '@/Components/Shop/ShopCatalog';
import ShopLayout from '@/Layouts/ShopLayout';
import { PageProps } from '@/types';
import { ShopIndexPageProps } from '@/types/shop';
import { Head } from '@inertiajs/react';

export default function ShopIndex({
    category,
    products,
    filters,
    filterOptions,
    categories,
}: PageProps<ShopIndexPageProps>) {
    const baseUrl = category
        ? route('shop.category', category.slug)
        : route('shop.index');

    const title = category?.name ?? 'All shoes';
    const subtitle = category
        ? `${products.meta.total} ${products.meta.total === 1 ? 'style' : 'styles'} in this collection`
        : `${products.meta.total} styles across every collection`;

    return (
        <ShopLayout>
            <Head title={title} />
            <ShopCatalog
                title={title}
                subtitle={subtitle}
                baseUrl={baseUrl}
                category={category}
                products={products}
                filters={filters}
                filterOptions={filterOptions}
                categories={categories}
            />
        </ShopLayout>
    );
}
