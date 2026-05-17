// ============================================
// Ghana Health App - Service Worker
// Cache-first strategy with network fallback
// ============================================

const CACHE_VERSION = 'ghana-health-v2';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/manifest.json',
    '/icons/icon.svg',
    '/data/meal-plan-30-days.json',
    '/data/workout-plan-4-weeks.json',
    '/data/ghanaian-ingredients.json'
];

// Install: cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then(cache => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys
                    .filter(key => key !== CACHE_VERSION)
                    .map(key => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

// Fetch: cache-first, network fallback
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request)
            .then(cached => {
                if (cached) {
                    // Return cached, but also update cache in background
                    const fetchPromise = fetch(event.request)
                        .then(response => {
                            if (response.ok) {
                                const clone = response.clone();
                                caches.open(CACHE_VERSION)
                                    .then(cache => cache.put(event.request, clone));
                            }
                            return response;
                        })
                        .catch(() => cached);

                    return cached;
                }

                // Not in cache, fetch from network
                return fetch(event.request)
                    .then(response => {
                        if (response.ok && event.request.url.startsWith(self.location.origin)) {
                            const clone = response.clone();
                            caches.open(CACHE_VERSION)
                                .then(cache => cache.put(event.request, clone));
                        }
                        return response;
                    });
            })
    );
});