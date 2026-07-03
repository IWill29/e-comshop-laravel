# Docker — Local Development

Run the Laravel shoe store locally with Docker. No need for `npm run dev` — assets are built automatically on first start (`npm run build`).

**Stack:** PHP 8.4, Nginx, PostgreSQL 16, Redis 7

**App URL:** http://localhost:8080

---

## Requirements

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows / macOS / Linux)
- Git

---

## Quick start

### 1. Clone and enter the project

```bash
git clone https://github.com/IWill29/e-comshop-laravel.git
cd e-comshop-laravel
```

### 2. Copy environment file (optional)

Docker Compose sets DB variables automatically. For local overrides:

```bash
cp .env.example .env
```

If using `.env` locally with Docker, set:

```env
APP_URL=http://localhost:8080
DB_CONNECTION=pgsql
DB_HOST=pgsql
DB_PORT=5432
DB_DATABASE=ecomshop
DB_USERNAME=ecomshop
DB_PASSWORD=secret
REDIS_HOST=redis
CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
```

### 3. Build and start containers

```bash
docker compose up -d --build
```

First run installs Composer deps, builds frontend assets, and runs migrations.

### 4. Open the app

http://localhost:8080

---

## Docker commands

| Action | Command |
|--------|---------|
| **Start** | `docker compose up -d` |
| **Start + rebuild** | `docker compose up -d --build` |
| **Stop** | `docker compose down` |
| **Stop + remove DB volume** | `docker compose down -v` |
| **View logs** | `docker compose logs -f` |
| **View app logs** | `docker compose logs -f app` |
| **Container status** | `docker compose ps` |
| **Shell inside app** | `docker compose exec app sh` |

---

## Laravel Pint (code style)

[Pint](https://laravel.com/docs/pint) formats PHP code to Laravel standards.

### Fix code style

```bash
docker compose exec app ./vendor/bin/pint
```

### Check without changing files (CI)

```bash
docker compose exec app ./vendor/bin/pint --test
```

### Via Composer

```bash
docker compose exec app composer pint
docker compose exec app composer pint:test
```

---

## PHPStan (static analysis)

[PHPStan](https://phpstan.org/) + [Larastan](https://github.com/larastan/larastan) finds bugs without running the app.

### Run analysis

```bash
docker compose exec app ./vendor/bin/phpstan analyse
```

### Via Composer

```bash
docker compose exec app composer phpstan
```

Config: [`phpstan.neon`](phpstan.neon) (level 5, scans `app/`)

---

## Other useful commands

```bash
# Artisan
docker compose exec app php artisan migrate
docker compose exec app php artisan migrate:fresh --seed
docker compose exec app php artisan tinker

# Tests
docker compose exec app php artisan test

# Rebuild frontend assets (after CSS/JS changes)
docker compose exec app npm run build

# Composer
docker compose exec app composer install
docker compose exec app composer update
```

---

## Services

| Service | Container | Port | Purpose |
|---------|-----------|------|---------|
| `nginx` | ecomshop-nginx | **8080** → 80 | Web server |
| `app` | ecomshop-app | 9000 (internal) | PHP-FPM + Composer + Node |
| `pgsql` | ecomshop-pgsql | 5432 (internal) | PostgreSQL |
| `redis` | ecomshop-redis | 6379 (internal) | Cache, sessions, queue |

---

## Project structure (Docker)

```
docker/
├── nginx/
│   └── default.conf      # Nginx site config
└── php/
    ├── Dockerfile        # PHP 8.4 + extensions + Node
    └── entrypoint.sh     # install deps, build assets, migrate
docker-compose.yml
.dockerignore
pint.json
phpstan.neon
```

---

## Troubleshooting

### Port 8080 already in use

Change the port in `docker-compose.yml`:

```yaml
nginx:
  ports:
    - "8888:80"   # use http://localhost:8888
```

### Permission errors (Linux)

```bash
sudo chown -R $USER:$USER storage bootstrap/cache
```

### Fresh start (reset database)

```bash
docker compose down -v
docker compose up -d --build
```

### Rebuild assets only

```bash
docker compose exec app npm run build
```

---

## Docker vs Vercel

| | Docker (local) | Vercel (production) |
|--|----------------|-------------------|
| Database | PostgreSQL in container | Neon / Supabase |
| Assets | Built in entrypoint | Built in `composer vercel` |
| Redis | Included | Upstash |
| Pint / PHPStan | `docker compose exec app ...` | Run locally or in CI |

---

*See also: [ARCHITECTURE.md](ARCHITECTURE.md)*
