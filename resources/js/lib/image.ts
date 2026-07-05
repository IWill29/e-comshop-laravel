import type { SyntheticEvent } from 'react';

// Shown when a product/category image fails to load, so the grid never breaks.
export const FALLBACK_SHOE_IMAGE =
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80';

export function handleImageError(event: SyntheticEvent<HTMLImageElement>): void {
    const img = event.currentTarget;

    if (img.dataset.fallbackApplied === 'true') {
        return;
    }

    img.dataset.fallbackApplied = 'true';
    img.src = FALLBACK_SHOE_IMAGE;
}
