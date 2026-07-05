export interface Category {
    id: number;
    name: string;
    slug: string;
    productCount?: number;
}

export interface ProductCategory {
    name: string;
    slug: string;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    brand: string;
    color: string;
    price: number;
    compareAtPrice: number | null;
    imageUrl: string;
    category?: ProductCategory;
}

export interface ProductDetail extends Product {
    sku: string;
    gender: string;
    description: string | null;
    stock: number;
    sizes: number[];
}

export interface CartItem {
    key: string;
    productId: number;
    name: string;
    slug: string;
    brand: string;
    color: string;
    imageUrl: string;
    size: number;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    maxQuantity: number;
}

export interface CatalogFilters {
    gender: string | null;
    brand: string | null;
    minPrice: number | null;
    maxPrice: number | null;
    size: number | null;
    sort: string;
    search?: string | null;
}

export interface FilterOptions {
    brands: string[];
    genders: string[];
    sizes: number[];
    priceRange: {
        min: number;
        max: number;
    };
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface Paginated<T> {
    data: T[];
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number | null;
        last_page: number;
        links: PaginationLink[];
        path: string;
        per_page: number;
        to: number | null;
        total: number;
    };
}

export type ShopIndexPageProps = {
    category: Category | null;
    products: Paginated<Product>;
    filters: CatalogFilters;
    filterOptions: FilterOptions;
    categories: Category[];
    pageTitle?: string | null;
    pageSubtitle?: string | null;
};

export type ShopSearchPageProps = ShopIndexPageProps & {
    query: string;
};

export type ProductShowPageProps = {
    product: ProductDetail;
};

export type CartIndexPageProps = {
    items: CartItem[];
    subtotal: number;
    itemCount: number;
};

export type HomePageProps = {
    featuredProducts: Product[];
    newArrivals: Product[];
    categories: Category[];
};
