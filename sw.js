// Evento de instalação: cacheia recursos essenciais
self.addEventListener('install', (event) => {
    console.log('Service Worker instalado');
    event.waitUntil(
        caches.open('acertos-cache-v1').then((cache) => {
            return cache.addAll([
                '/',                    // Página principal
                '/manifest.json',       // Manifesto do PWA
                '/icons/pwa.svg',       // Ícone do PWA
                '/icons/whats.svg',     // Ícone do WhatsApp
                '/icons/bicho.svg',     // Ícone do Jogo do Bicho
                '/icons/casino.svg',    // Ícone do Cassino
                '/cards/acertosclub.webp',
                '/cards/aguiaoficial.webp',
                '/offline.html'         // Página offline personalizada
            ]);
        }).then(() => self.skipWaiting())
    );
});

// Evento de ativação: limpa caches antigos
self.addEventListener('activate', (event) => {
    console.log('Service Worker ativado');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== 'acertos-cache-v1') {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Evento de fetch: tenta rede, retorna cache offline se falhar
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match('/offline.html') || new Response('Você está offline. Conecte-se à internet para continuar.', {
                headers: { 'Content-Type': 'text/plain' }
            });
        })
    );
});
