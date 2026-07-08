export interface Category {
    id: number;
    name: string;
    slug: string;
    productCount?: number;
    imageUrl?: string;
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
    query?: string | null;
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
};

export type ShopCollectionPageProps = ShopIndexPageProps;

export type ProductShowPageProps = {
    product: ProductDetail;
};

export type CartIndexPageProps = {
    items: CartItem[];
    subtotal: number;
    itemCount: number;
};

export interface HeroProduct {
    name: string;
    slug: string;
    brand: string;
    imageUrl: string;
}

export type HomePageProps = {
    heroImageUrl: string | null;
    heroProductName: string | null;
    heroProduct: HeroProduct | null;
    featuredProducts: Product[];
    categories: Category[];
    newArrivals?: Product[];
};

export interface CartLineItem {
    key: string;
    productId: number;
    name: string;
    slug: string;
    brand: string;
    size: number;
    quantity: number;
    unitPrice: number;
    imageUrl: string;
}

export interface CheckoutSummary {
    subtotal: number;
    shipping: number;
    total: number;
    currency: string;
}

export interface CheckoutFormDefaults {
    email: string;
    name: string;
    line1: string;
    line2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

export type CheckoutIndexPageProps = {
    items: CartLineItem[];
    summary: CheckoutSummary;
    defaults: CheckoutFormDefaults;
};

export interface CheckoutOrderItem {
    productName: string;
    size: number | null;
    quantity: number;
    unitPrice: number;
}

export interface CheckoutOrder {
    id: number;
    number: string;
    email: string;
    total: number;
    currency: string;
    items: CheckoutOrderItem[];
    placedAt: string;
}

export type CheckoutSuccessPageProps = {
    order: CheckoutOrder | null;
};

export type CheckoutCancelPageProps = {
    message?: string | null;
};

export interface AccountOrderSummary {
    id: number;
    number: string;
    total: number;
    currency: string;
    status: string;
    paymentStatus: string;
    itemCount: number;
    placedAt: string;
}

export interface AccountOrderDetail extends AccountOrderSummary {
    email: string;
    items: CheckoutOrderItem[];
}

export type AccountOrdersPageProps = {
    orders: Paginated<AccountOrderSummary>;
};

export type AccountOrderShowPageProps = {
    order: AccountOrderDetail;
};
