import ShopCatalog from '@/Components/Shop/ShopCatalog';
import ShopLayout from '@/Layouts/ShopLayout';
import { PageProps } from '@/types';
import { ShopIndexPageProps } from '@/types/shop';
import { Head } from '@inertiajs/react';

export default function ShopNewArrivals({
    products,
    filters,
    filterOptions,
    categories,
    pageTitle,
    pageSubtitle,
}: PageProps<ShopIndexPageProps>) {
    const title = pageTitle ?? 'New arrivals';
    const subtitle =
        pageSubtitle ??
        `${products.meta.total} latest ${products.meta.total === 1 ? 'drop' : 'drops'}`;

    return (
        <ShopLayout>
            <Head title={title} />
            <ShopCatalog
                title={title}
                subtitle={subtitle}
                baseUrl={route('shop.new-arrivals')}
                category={null}
                products={products}
                filters={filters}
                filterOptions={filterOptions}
                categories={categories}
            />
        </ShopLayout>
    );
}
