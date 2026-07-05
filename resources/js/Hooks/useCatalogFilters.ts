import { CatalogFilters } from '@/types/shop';
import { router } from '@inertiajs/react';

function buildQueryParams(filters: Partial<CatalogFilters>): Record<string, string | number> {
    const params: Record<string, string | number> = {};

    if (filters.gender) {
        params.gender = filters.gender;
    }
    if (filters.brand) {
        params.brand = filters.brand;
    }
    if (filters.minPrice != null) {
        params.min_price = filters.minPrice;
    }
    if (filters.maxPrice != null) {
        params.max_price = filters.maxPrice;
    }
    if (filters.size != null) {
        params.size = filters.size;
    }
    if (filters.sort && filters.sort !== 'newest') {
        params.sort = filters.sort;
    }
    if (filters.search) {
        params.q = filters.search;
    }

    return params;
}

export function useCatalogFilters(
    baseUrl: string,
    filters: CatalogFilters,
    preserved: Record<string, string> = {},
) {
    const applyFilters = (updates: Partial<CatalogFilters>) => {
        const next = { ...filters, ...updates };

        router.get(baseUrl, { ...preserved, ...buildQueryParams(next) }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        router.get(baseUrl, preserved, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return { applyFilters, clearFilters };
}
