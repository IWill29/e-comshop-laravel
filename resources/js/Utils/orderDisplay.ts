export function formatOrderDate(
    isoDate: string,
    dateStyle: 'medium' | 'long' = 'medium',
): string {
    return new Intl.DateTimeFormat('en-US', {
        dateStyle,
        timeStyle: 'short',
    }).format(new Date(isoDate));
}

export function orderStatusLabel(status: string): string {
    switch (status) {
        case 'paid':
            return 'Paid';
        case 'pending':
            return 'Pending';
        case 'cancelled':
            return 'Cancelled';
        case 'refunded':
            return 'Refunded';
        default:
            return status;
    }
}

export function orderStatusClasses(status: string): string {
    switch (status) {
        case 'paid':
            return 'bg-emerald-50 text-emerald-700 ring-emerald-100';
        case 'pending':
            return 'bg-amber-50 text-amber-700 ring-amber-100';
        case 'cancelled':
            return 'bg-stone-100 text-stone-600 ring-stone-200';
        case 'refunded':
            return 'bg-indigo-50 text-indigo-700 ring-indigo-100';
        default:
            return 'bg-stone-100 text-stone-600 ring-stone-200';
    }
}
