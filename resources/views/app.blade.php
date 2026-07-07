<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <link rel="preconnect" href="https://res.cloudinary.com" crossorigin>
        <link rel="dns-prefetch" href="https://res.cloudinary.com">

        @php
            $isHome = ($page['component'] ?? '') === 'Home';
            $heroImageUrl = data_get($page, 'props.heroImageUrl');
        @endphp
        @if ($isHome && is_string($heroImageUrl) && $heroImageUrl !== '')
            <link rel="preload" as="image" href="{{ $heroImageUrl }}" fetchpriority="high">
        @endif

        <!-- Fonts (non-blocking — display=swap fallback until loaded) -->
        <link rel="preconnect" href="https://fonts.bunny.net" crossorigin>
        <link
            rel="stylesheet"
            href="https://fonts.bunny.net/css?family=outfit:400,500,600,700|syne:600,700,800&display=swap"
            media="print"
            onload="this.media='all'"
        >
        <noscript>
            <link href="https://fonts.bunny.net/css?family=outfit:400,500,600,700|syne:600,700,800&display=swap" rel="stylesheet">
        </noscript>

        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        <div id="app" data-page="{{ json_encode($page) }}">
            @if ($isHome && is_string($heroImageUrl) && $heroImageUrl !== '')
                @include('partials.home-lcp-shell', [
                    'heroImageUrl' => $heroImageUrl,
                    'page' => $page,
                ])
            @endif
        </div>

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
    </body>
</html>
