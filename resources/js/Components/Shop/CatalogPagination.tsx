import { Paginated, Product } from '@/types/shop';
import { Link } from '@inertiajs/react';

interface CatalogPaginationProps {
    pagination: Paginated<Product>;
}

export default function CatalogPagination({ pagination }: Readonly<CatalogPaginationProps>) {
    const { meta, links } = pagination;

    if (meta.last_page <= 1) {
        return null;
    }

    return (
        <nav
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-between"
            aria-label="Pagination"
        >
            <p className="text-sm text-stone-600">
                Showing{' '}
                <span className="font-medium text-stone-900">{meta.from ?? 0}</span>
                {' – '}
                <span className="font-medium text-stone-900">{meta.to ?? 0}</span>
                {' of '}
                <span className="font-medium text-stone-900">{meta.total}</span>
            </p>

            <div className="flex items-center gap-1">
                {links.prev ? (
                    <Link
                        href={links.prev}
                        preserveScroll
                        preserveState
                        className="inline-flex min-h-10 items-center rounded-xl border border-stone-200 bg-white px-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                    >
                        Previous
                    </Link>
                ) : (
                    <span className="inline-flex min-h-10 cursor-not-allowed items-center rounded-xl border border-stone-100 px-3 text-sm text-stone-400">
                        Previous
                    </span>
                )}

                <div className="hidden items-center gap-1 sm:flex">
                    {meta.links
                        .filter((link) => link.label !== '&laquo; Previous' && link.label !== 'Next &raquo;')
                        .map((link) =>
                            link.url ? (
                                <Link
                                    key={link.label}
                                    href={link.url}
                                    preserveScroll
                                    preserveState
                                    className={`inline-flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-medium transition ${
                                        link.active
                                            ? 'bg-indigo-600 text-white'
                                            : 'text-stone-700 hover:bg-stone-100'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <span
                                    key={link.label}
                                    className="inline-flex h-10 min-w-10 items-center justify-center px-3 text-sm text-stone-400"
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ),
                        )}
                </div>

                {links.next ? (
                    <Link
                        href={links.next}
                        preserveScroll
                        preserveState
                        className="inline-flex min-h-10 items-center rounded-xl border border-stone-200 bg-white px-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                    >
                        Next
                    </Link>
                ) : (
                    <span className="inline-flex min-h-10 cursor-not-allowed items-center rounded-xl border border-stone-100 px-3 text-sm text-stone-400">
                        Next
                    </span>
                )}
            </div>
        </nav>
    );
}
