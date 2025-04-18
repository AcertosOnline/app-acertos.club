self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('acertos-cache-v1').then((cache) => {
            return cache.addAll([
                '/',
                '/manifest.json',
                '/icons/favicon32.webp',
                '/icons/favicon180.webp',
                '/icons/favicon16.webp',
                '/icons/favicon.ico',
                '/icons/pwa.svg',
                '/icons/whats.svg',
                '/icons/bicho.svg',
                '/icons/casino.svg',
                '/offline.html'
            ]);
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = ['acertos-cache-v1'];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const url = event.request.url;
    if (url.includes('app.acertos.club')) {
        event.respondWith(
            fetch(event.request).catch(() => caches.match('/offline.html'))
        );
    } else if (url.includes('chrome-extension') || event.request.method !== 'GET') {
        event.respondWith(fetch(event.request));
    } else {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request).then((fetchResponse) => {
                    if (fetchResponse.ok) {
                        return caches.open('acertos-cache-v1').then((cache) => {
                            cache.put(event.request, fetchResponse.clone());
                            return fetchResponse;
                        });
                    }
                    return fetchResponse;
                }).catch(() => caches.match('/offline.html'));
            })
        );
    }
});
