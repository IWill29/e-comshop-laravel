{{-- Painted before JS — React replaces #app contents on first render. --}}
@php
    $heroName = data_get($page, 'props.heroProductName', 'Featured product');
@endphp
<style>
    .home-lcp {
        background: #0c0a09;
        color: #fff;
        overflow-x: clip;
    }
    .home-lcp__inner {
        max-width: 80rem;
        margin: 0 auto;
        padding: 3rem 1rem 2.5rem;
        display: grid;
        gap: 2rem;
    }
    .home-lcp__eyebrow {
        display: inline-flex;
        max-width: 100%;
        align-items: center;
        border-radius: 9999px;
        border: 1px solid rgb(255 255 255 / 0.15);
        background: rgb(255 255 255 / 0.05);
        padding: 0.25rem 0.75rem;
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: #a5b4fc;
    }
    .home-lcp__title {
        margin: 1rem 0 0;
        font-size: clamp(2.25rem, 8vw, 4.5rem);
        font-weight: 800;
        line-height: 0.95;
        letter-spacing: -0.02em;
    }
    .home-lcp__media {
        margin: 0;
        border-radius: 1rem;
        overflow: hidden;
        background: #1c1917;
        box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.1);
    }
    .home-lcp__media img {
        display: block;
        width: 100%;
        aspect-ratio: 4 / 3;
        object-fit: cover;
    }
    @media (min-width: 640px) {
        .home-lcp__inner { padding: 4rem 1.5rem 3.5rem; gap: 2.5rem; }
        .home-lcp__media { border-radius: 1.25rem; }
        .home-lcp__media img { aspect-ratio: 5 / 4; }
    }
    @media (min-width: 1024px) {
        .home-lcp__inner {
            grid-template-columns: 1.05fr 0.95fr;
            align-items: center;
            gap: 2rem;
            padding: 6rem 2rem 5rem;
        }
        .home-lcp__media { border-radius: 2rem; }
    }
</style>
<section class="home-lcp" aria-label="Loading storefront">
    <div class="home-lcp__inner">
        <div>
            <p class="home-lcp__eyebrow">Paradit X — Spring/Summer 26</p>
            <h1 class="home-lcp__title">Shoes for every stride</h1>
        </div>
        <figure class="home-lcp__media">
            <img
                src="{{ $heroImageUrl }}"
                alt="{{ $heroName }}"
                width="1200"
                height="960"
                fetchpriority="high"
                loading="eager"
                decoding="async"
            >
        </figure>
    </div>
</section>
