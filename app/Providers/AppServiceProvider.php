<?php

namespace App\Providers;

use App\Database\NeonPostgresConnector;
use App\Database\RedisAvailability;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind('db.connector.pgsql', NeonPostgresConnector::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RedisAvailability::applyRuntimeFallback();

        JsonResource::withoutWrapping();

        Vite::prefetch(concurrency: 3);
    }
}
