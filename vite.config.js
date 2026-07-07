import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    build: {
        emptyOutDir: true,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (
                        id.includes('node_modules/react-dom')
                        || id.includes('node_modules/react/')
                    ) {
                        return 'react-vendor';
                    }

                    if (id.includes('node_modules/@inertiajs')) {
                        return 'inertia-vendor';
                    }
                },
            },
        },
    },
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            refresh: true,
        }),
        react(),
    ],
});
