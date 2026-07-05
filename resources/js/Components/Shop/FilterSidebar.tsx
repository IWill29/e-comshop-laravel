import { CatalogFilters, FilterOptions } from '@/types/shop';
import { useCatalogFilters } from '@/Hooks/useCatalogFilters';
import { formatPrice } from '@/Hooks/useFormatPrice';
import { useState } from 'react';

interface FilterSidebarProps {
    baseUrl: string;
    filters: CatalogFilters;
    filterOptions: FilterOptions;
    mode?: 'mobile' | 'desktop';
    preservedQueryParams?: Record<string, string>;
}

const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price_asc', label: 'Price: low to high' },
    { value: 'price_desc', label: 'Price: high to low' },
] as const;

const genderLabels: Record<string, string> = {
    men: 'Men',
    women: 'Women',
    unisex: 'Unisex',
    kids: 'Kids',
};

function FilterFields({
    baseUrl,
    filters,
    filterOptions,
    preservedQueryParams = {},
    onNavigate,
}: FilterSidebarProps & { onNavigate?: () => void }) {
    const { applyFilters, clearFilters } = useCatalogFilters(
        baseUrl,
        filters,
        preservedQueryParams,
    );
    const hasActiveFilters =
        filters.gender !== null ||
        filters.brand !== null ||
        filters.minPrice !== null ||
        filters.maxPrice !== null ||
        filters.size !== null ||
        filters.search != null ||
        filters.sort !== 'newest';

    const handleChange = (updates: Partial<CatalogFilters>) => {
        applyFilters(updates);
        onNavigate?.();
    };

    return (
        <div className="space-y-6">
            <div>
                <label
                    htmlFor="catalog-sort"
                    className="text-xs font-semibold uppercase tracking-widest text-stone-500"
                >
                    Sort
                </label>
                <select
                    id="catalog-sort"
                    value={filters.sort}
                    onChange={(event) => handleChange({ sort: event.target.value })}
                    className="mt-2 w-full rounded-xl border-stone-200 bg-white text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                    {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">
                    Gender
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                    {filterOptions.genders.map((gender) => (
                        <button
                            key={gender}
                            type="button"
                            onClick={() =>
                                handleChange({
                                    gender: filters.gender === gender ? null : gender,
                                })
                            }
                            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                                filters.gender === gender
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                            }`}
                        >
                            {genderLabels[gender] ?? gender}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label
                    htmlFor="catalog-brand"
                    className="text-xs font-semibold uppercase tracking-widest text-stone-500"
                >
                    Brand
                </label>
                <select
                    id="catalog-brand"
                    value={filters.brand ?? ''}
                    onChange={(event) =>
                        handleChange({
                            brand: event.target.value || null,
                        })
                    }
                    className="mt-2 w-full rounded-xl border-stone-200 bg-white text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                    <option value="">All brands</option>
                    {filterOptions.brands.map((brand) => (
                        <option key={brand} value={brand}>
                            {brand}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">
                    Size (EU)
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                    {filterOptions.sizes.map((size) => (
                        <button
                            key={size}
                            type="button"
                            onClick={() =>
                                handleChange({
                                    size: filters.size === size ? null : size,
                                })
                            }
                            className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-xs font-semibold transition ${
                                filters.size === size
                                    ? 'bg-stone-900 text-white'
                                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                            }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">
                    Price range
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                    <div>
                        <label htmlFor="min-price" className="sr-only">
                            Minimum price
                        </label>
                        <input
                            id="min-price"
                            type="number"
                            min={0}
                            step={100}
                            placeholder="Min"
                            defaultValue={
                                filters.minPrice != null ? filters.minPrice / 100 : ''
                            }
                            onBlur={(event) => {
                                const value = event.target.value
                                    ? Math.round(Number(event.target.value) * 100)
                                    : null;
                                handleChange({ minPrice: value });
                            }}
                            className="w-full rounded-xl border-stone-200 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="max-price" className="sr-only">
                            Maximum price
                        </label>
                        <input
                            id="max-price"
                            type="number"
                            min={0}
                            step={100}
                            placeholder="Max"
                            defaultValue={
                                filters.maxPrice != null ? filters.maxPrice / 100 : ''
                            }
                            onBlur={(event) => {
                                const value = event.target.value
                                    ? Math.round(Number(event.target.value) * 100)
                                    : null;
                                handleChange({ maxPrice: value });
                            }}
                            className="w-full rounded-xl border-stone-200 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                </div>
                <p className="mt-1.5 text-[11px] text-stone-500">
                    {formatPrice(filterOptions.priceRange.min)} –{' '}
                    {formatPrice(filterOptions.priceRange.max)}
                </p>
            </div>

            {hasActiveFilters && (
                <button
                    type="button"
                    onClick={() => {
                        clearFilters();
                        onNavigate?.();
                    }}
                    className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                >
                    Clear filters
                </button>
            )}
        </div>
    );
}

export default function FilterSidebar({
    mode = 'desktop',
    ...props
}: FilterSidebarProps) {
    const [mobileOpen, setMobileOpen] = useState(false);

    if (mode === 'desktop') {
        return (
            <aside>
                <FilterFields {...props} />
            </aside>
        );
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 text-sm font-medium text-stone-700 shadow-sm transition hover:bg-stone-50"
            >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                </svg>
                Filters
            </button>

            {mobileOpen && (
                <div className="fixed inset-0 z-50">
                    <button
                        type="button"
                        className="absolute inset-0 bg-stone-950/40 backdrop-blur-sm"
                        aria-label="Close filters"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-stone-50 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-stone-200 px-4 py-4">
                            <h2 className="font-display text-lg font-bold text-stone-900">
                                Filters
                            </h2>
                            <button
                                type="button"
                                onClick={() => setMobileOpen(false)}
                                className="flex h-10 w-10 items-center justify-center rounded-xl text-stone-600 hover:bg-stone-100"
                                aria-label="Close"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-4 py-6 scroll-touch">
                            <FilterFields
                                {...props}
                                onNavigate={() => setMobileOpen(false)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
