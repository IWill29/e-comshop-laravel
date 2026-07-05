import { formatPrice } from '@/Hooks/useFormatPrice';
import { handleImageError } from '@/lib/image';
import { Product } from '@/types/shop';
import { Link, router } from '@inertiajs/react';
import {
    FormEvent,
    KeyboardEvent,
    useEffect,
    useId,
    useRef,
    useState,
} from 'react';

interface SearchSuggestionsResponse {
    query: string;
    suggestions: Product[];
}

interface ProductSearchProps {
    id?: string;
    defaultValue?: string;
    placeholder?: string;
    className?: string;
    inputClassName?: string;
    showSubmitButton?: boolean;
    autoFocus?: boolean;
}

export default function ProductSearch({
    id,
    defaultValue = '',
    placeholder = 'Search shoes…',
    className = '',
    inputClassName = '',
    showSubmitButton = false,
    autoFocus = false,
}: Readonly<ProductSearchProps>) {
    const listboxId = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const [query, setQuery] = useState(defaultValue);
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const trimmedQuery = query.trim();
    const hasQuery = trimmedQuery.length >= 2;
    const showSuggestions = hasQuery && suggestions.length > 0;
    const showEmptyState = hasQuery && !isLoading && suggestions.length === 0;
    const showPanel = isOpen && hasQuery && (showSuggestions || showEmptyState || isLoading);

    useEffect(() => {
        setQuery(defaultValue);
    }, [defaultValue]);

    useEffect(() => {
        if (!hasQuery) {
            setSuggestions([]);
            setIsLoading(false);
            return;
        }

        const controller = new AbortController();
        setIsLoading(true);

        const timeout = window.setTimeout(async () => {
            try {
                const url = new URL(route('shop.search.suggestions'), window.location.origin);
                url.searchParams.set('q', trimmedQuery);

                const response = await fetch(url.toString(), {
                    headers: { Accept: 'application/json' },
                    signal: controller.signal,
                });

                if (!response.ok) {
                    setSuggestions([]);
                    return;
                }

                const data: SearchSuggestionsResponse = await response.json();
                setSuggestions(data.suggestions);
                setActiveIndex(-1);
            } catch {
                if (!controller.signal.aborted) {
                    setSuggestions([]);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }, 250);

        return () => {
            controller.abort();
            window.clearTimeout(timeout);
        };
    }, [hasQuery, trimmedQuery]);

    useEffect(() => {
        const handlePointerDown = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handlePointerDown);

        return () => document.removeEventListener('mousedown', handlePointerDown);
    }, []);

    const navigateToSearch = (nextQuery: string) => {
        const params = nextQuery.trim() ? { q: nextQuery.trim() } : {};

        router.get(route('shop.search'), params, {
            preserveState: true,
            replace: true,
        });
        setIsOpen(false);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        navigateToSearch(query);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (!showPanel) {
            return;
        }

        const itemCount = showSuggestions ? suggestions.length + 1 : 0;

        if (event.key === 'ArrowDown' && itemCount > 0) {
            event.preventDefault();
            setActiveIndex((current) => (current + 1) % itemCount);
        }

        if (event.key === 'ArrowUp' && itemCount > 0) {
            event.preventDefault();
            setActiveIndex((current) => (current <= 0 ? itemCount - 1 : current - 1));
        }

        if (event.key === 'Escape') {
            setIsOpen(false);
            setActiveIndex(-1);
        }

        if (event.key === 'Enter' && activeIndex >= 0 && showSuggestions) {
            event.preventDefault();

            if (activeIndex < suggestions.length) {
                router.visit(route('products.show', suggestions[activeIndex].slug));
                setIsOpen(false);
                return;
            }

            navigateToSearch(trimmedQuery);
        }
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <div className="relative min-w-0 flex-1">
                    <label htmlFor={id} className="sr-only">
                        Search shoes
                    </label>
                    <input
                        id={id}
                        name="q"
                        type="search"
                        value={query}
                        autoFocus={autoFocus}
                        autoComplete="off"
                        role="combobox"
                        aria-expanded={showPanel}
                        aria-controls={listboxId}
                        aria-autocomplete="list"
                        placeholder={placeholder}
                        onChange={(event) => {
                            setQuery(event.target.value);
                            setIsOpen(event.target.value.trim().length >= 2);
                        }}
                        onFocus={() => {
                            if (query.trim().length >= 2) {
                                setIsOpen(true);
                            }
                        }}
                        onKeyDown={handleKeyDown}
                        className={
                            inputClassName ||
                            'h-10 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/20'
                        }
                    />
                </div>

                {showSubmitButton && (
                    <button
                        type="submit"
                        className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-500"
                    >
                        Search
                    </button>
                )}
            </form>

            {showPanel && (
                <div
                    id={listboxId}
                    role="listbox"
                    className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_12px_40px_-8px_rgb(0_0_0_/_0.15)]"
                >
                    {isLoading && (
                        <p className="px-4 py-3 text-sm text-stone-500">Searching…</p>
                    )}

                    {showSuggestions && !isLoading && (
                        <ul className="py-2">
                            {suggestions.map((product, index) => (
                                <li key={product.id}>
                                    <Link
                                        href={route('products.show', product.slug)}
                                        role="option"
                                        aria-selected={activeIndex === index}
                                        className={`flex items-center gap-3 px-4 py-2.5 transition hover:bg-stone-50 ${
                                            activeIndex === index ? 'bg-indigo-50' : ''
                                        }`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <img
                                            src={product.imageUrl}
                                            alt=""
                                            onError={handleImageError}
                                            className="h-12 w-12 rounded-lg bg-stone-100 object-cover"
                                        />
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-sm font-medium text-stone-900">
                                                {product.name}
                                            </span>
                                            <span className="block truncate text-xs text-stone-500">
                                                {product.brand}
                                            </span>
                                        </span>
                                        <span className="shrink-0 text-sm font-semibold text-stone-900">
                                            {formatPrice(product.price)}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                            <li className="border-t border-stone-100">
                                <button
                                    type="button"
                                    role="option"
                                    aria-selected={activeIndex === suggestions.length}
                                    className={`flex min-h-11 w-full items-center px-4 text-left text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 ${
                                        activeIndex === suggestions.length ? 'bg-indigo-50' : ''
                                    }`}
                                    onClick={() => navigateToSearch(trimmedQuery)}
                                >
                                    View all results for “{trimmedQuery}”
                                </button>
                            </li>
                        </ul>
                    )}

                    {showEmptyState && (
                        <div className="px-4 py-4">
                            <p className="text-sm text-stone-600">
                                No matches for “{trimmedQuery}”.
                            </p>
                            <button
                                type="button"
                                className="mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                                onClick={() => navigateToSearch(trimmedQuery)}
                            >
                                Search anyway
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
