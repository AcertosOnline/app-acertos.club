self.addEventListener('install', (event) => {
    console.log('Service Worker instalado');
    event.waitUntil(self.skipWaiting()); // Ativa o SW imediatamente
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker ativado');
    event.waitUntil(self.clients.claim()); // Toma controle das páginas
});

self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request).catch(() => {
        return new Response('Offline'); // Resposta básica para offline
    }));
});