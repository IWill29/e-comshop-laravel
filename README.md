# Paradit X — Online Shoe Store

> English-language e-commerce demo for [paradit-x.com](https://paradit-x.com) — sneakers, boots, casual, and sport footwear with Stripe checkout.

[![Laravel](https://img.shields.io/badge/Laravel-13-red?style=flat-square&logo=laravel)](https://laravel.com)
[![PHP](https://img.shields.io/badge/PHP-8.3+-777BB4?style=flat-square&logo=php)](https://php.net)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**[Live demo](https://e-comportf-project.vercel.app)** · **[Architecture](./ARCHITECTURE.md)** · **[Docker guide](./DOCKER.md)**

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Quick setup (SQLite)](#quick-setup-sqlite)
  - [Docker (recommended)](#docker-recommended)
- [Environment Variables](#environment-variables)
- [Testing & Code Quality](#testing--code-quality)
- [Deployment (Vercel)](#deployment-vercel)
- [Stripe Webhooks (local)](#stripe-webhooks-local)
- [Roadmap](#roadmap)
- [Security](#security)
- [License](#license)

---

## About

Paradit X is a professional e-commerce showcase built with **Laravel 13**, **Inertia.js**, and **React**. It demonstrates a full storefront flow — product catalog, cart, guest checkout, Stripe payments, order history, and account management — deployed on **Vercel** with **PostgreSQL** (Neon), **Redis** (Upstash), and **Cloudinary** CDN.

The demo catalog includes ~20 shoes across 8 categories, seeded from JSON data in `database/data/`.

---

## Features

| Area | What's included |
|------|-----------------|
| **Storefront** | Home, shop catalog, category pages, product detail, sale & new arrivals |
| **Search** | Full-text search with header autocomplete (`ILIKE` on PostgreSQL) |
| **Cart** | Session-based cart (Redis-backed on Vercel) |
| **Checkout** | Guest checkout → Stripe Checkout Session → success / cancel pages |
| **Payments** | Stripe test mode, webhook handling, stock reservation & release |
| **Account** | Register, login, profile settings, order history & order detail |
| **Images** | Cloudinary CDN with named transforms (`ecomshop_card`, `ecomshop_detail`, etc.) |
| **UI** | Premium shop design — indigo accent, Syne/Outfit fonts, responsive layout |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Laravel 13, PHP 8.3+ |
| Frontend | Inertia.js 2, React 18, TypeScript, Tailwind CSS |
| Build | Vite 7 |
| Database | PostgreSQL (Neon in production, Docker locally) |
| Cache / Sessions | Redis (Upstash on Vercel, Docker locally) |
| Payments | Stripe (Checkout Sessions + webhooks) |
| Media | Cloudinary |
| Deploy | Vercel (PHP serverless + static assets) |
| Dev tooling | PHPStan, Laravel Pint, PHPUnit |

---

## Project Structure

```
app/
├── Actions/              # Business operations (checkout, cart, webhooks)
├── Services/             # CartService, ShopCacheService, ProductImageService
├── DTOs/                 # CheckoutData, CartItemData, CatalogFiltersData
├── Enums/                # OrderStatus, PaymentStatus, ProductImageSize
├── Http/Controllers/     # Thin controllers
└── Models/               # Product, Category, Order, OrderItem, User

resources/js/
├── Pages/                # Inertia pages (Home, Shop, Cart, Checkout, Auth, Account)
├── Components/           # Reusable shop UI components
└── Layouts/              # ShopLayout, AuthLayout

database/
├── data/                 # demo_products.json, demo_categories.json
├── migrations/
└── seeders/

api/index.php             # Vercel serverless entry point
vercel.json               # Vercel routing & env defaults
```

For the full architecture checklist, deployment details, and phase progress, see **[ARCHITECTURE.md](./ARCHITECTURE.md)**.

---

## Getting Started

### Prerequisites

- PHP 8.3+, Composer 2
- Node.js 20+, npm
- PostgreSQL & Redis (or use Docker — see below)

### Quick setup (SQLite)

Fastest way to explore the app locally with SQLite:

```bash
git clone https://github.com/IWill29/e-comshop-laravel.git
cd e-comshop-laravel

cp .env.example .env
composer install
npm install

php artisan key:generate
php artisan migrate --seed
npm run build
```

Start the dev server:

```bash
composer dev
```

Open **http://127.0.0.1:8000**.

> SQLite works for local development only. Vercel serverless requires PostgreSQL — use Neon or Docker for production-like setup.

### Docker (recommended)

For PostgreSQL + Redis matching production:

```bash
cp .env.docker.example .env.docker
# Edit .env.docker — set POSTGRES_PASSWORD and DB_PASSWORD to the same value

docker compose up -d --build
```

Open **http://localhost:8080**.

Full Docker documentation — volumes, troubleshooting, manual commands — is in **[DOCKER.md](./DOCKER.md)**.

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values you need.

| Variable | Required | Description |
|----------|----------|-------------|
| `APP_KEY` | Yes | `php artisan key:generate` |
| `APP_URL` | Yes | `http://127.0.0.1:8000` (local) or production URL |
| `DB_URL` | Vercel / Docker | PostgreSQL connection string (Neon `postgresql://...`) |
| `REDIS_URL` | Vercel | Upstash Redis URL (`rediss://...`) |
| `STRIPE_KEY` | Checkout | Stripe publishable key (test mode) |
| `STRIPE_SECRET` | Checkout | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Webhooks | From Stripe CLI or Dashboard |
| `CLOUDINARY_URL` | Vercel | Cloudinary API URL for image uploads |
| `CLOUDINARY_CLOUD_NAME` | CDN | Cloud name for image delivery (`rnihysop` on Vercel) |

On Vercel, `vercel.json` sets `SESSION_DRIVER`, `CACHE_STORE`, and `REDIS_CLIENT` automatically. See `.env.example` for full comments.

---

## Testing & Code Quality

```bash
# Run all tests (63 tests — feature + unit)
composer test

# Static analysis
composer phpstan

# Code style (fix)
composer pint

# Code style (check only)
composer pint:test
```

Test coverage includes shop catalog, cart, checkout, Stripe webhooks, account orders, auth, and Cloudinary image URL building.

---

## Deployment (Vercel)

1. Connect the GitHub repo to Vercel.
2. Set environment variables in **Vercel Dashboard → Settings → Environment Variables**:
   - `APP_KEY`, `APP_URL`
   - `DB_URL` (Neon PostgreSQL)
   - `REDIS_URL` (Upstash Redis)
   - `STRIPE_KEY`, `STRIPE_SECRET`, `STRIPE_WEBHOOK_SECRET`
   - `CLOUDINARY_URL`
3. Frontend assets (`public/build/`) must be committed — Vercel serves them as static files.
4. Build command: `composer vercel` (runs migrate + route/view cache).

```bash
# Build frontend locally before pushing
npm run build
git add public/build
```

Live deployment: **https://e-comportf-project.vercel.app**

---

## Stripe Webhooks (local)

Use the Stripe CLI to forward webhook events during development:

```bash
stripe listen --forward-to http://127.0.0.1:8000/stripe/webhook
```

Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET` in `.env`.

For production, register the webhook endpoint in the [Stripe Dashboard](https://dashboard.stripe.com/webhooks) pointing to `https://your-domain.com/stripe/webhook`.

---

## Roadmap

| Phase | Status | Highlights |
|-------|--------|------------|
| **Phase 0** — Foundation | Done | Laravel 13, Breeze, Inertia, React, Vercel config |
| **Phase 1** — MVP | Done | DB, shop UI, Stripe checkout, webhooks |
| **Phase 2** — Polish | In progress | Redis, Cloudinary CDN, 63 tests, search |
| **Phase 3** — Showcase | Planned | CI/CD, custom domain, legal pages, live Stripe |

See **[ARCHITECTURE.md](./ARCHITECTURE.md)** for the detailed checklist.

---

## Security

- CSRF protection on all forms (webhook route exempt)
- Stripe webhook signature verification
- Mass assignment protection on all models
- Secrets stored in environment variables, never committed
- Trust proxies configured for Vercel / load balancers

Report security issues privately to the repository owner — do not open public issues for vulnerabilities.

---

## License

This project is open-source software licensed under the [MIT license](https://opensource.org/licenses/MIT).

---

## Acknowledgements

Built with [Laravel](https://laravel.com), [Inertia.js](https://inertiajs.com), [Stripe](https://stripe.com), [Cloudinary](https://cloudinary.com), and deployed on [Vercel](https://vercel.com).
