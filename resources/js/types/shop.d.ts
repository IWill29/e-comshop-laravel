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

export type HomePageProps = {
    featuredProducts: Product[];
    newArrivals: Product[];
    categories: Category[];
};
