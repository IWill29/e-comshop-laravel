import type { SyntheticEvent } from 'react';

const FALLBACK_SHOE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" fill="none" aria-hidden="true"><rect width="400" height="400" fill="#e7e5e4"/><path d="M95 255c28-52 78-82 132-82h58c36 0 64 18 82 48l28 52H72l23-18z" fill="#a8a29e"/><path d="M118 238c18-28 48-44 82-44h46c22 0 38 12 48 28" stroke="#78716c" stroke-width="8" stroke-linecap="round"/></svg>`;

// Local SVG placeholder — no external image hosts.
export const FALLBACK_SHOE_IMAGE = `data:image/svg+xml,${encodeURIComponent(FALLBACK_SHOE_SVG)}`;

export function handleImageError(event: SyntheticEvent<HTMLImageElement>): void {
    const img = event.currentTarget;

    if (img.dataset.fallbackApplied === 'true') {
        return;
    }

    img.dataset.fallbackApplied = 'true';
    img.src = FALLBACK_SHOE_IMAGE;
}
