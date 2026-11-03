const CACHE_NAME = 'finer-v3-cache-v1';

const CACHE_NAME = 'finer-v3-cache-v2'; // bump on change

const STATIC_ASSETS = [
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // CRUCIAL: Do not cache AI agent /api routes or POST requests
  if (event.request.method !== 'GET' || event.request.url.includes('/api/')) {
    return;
  }
 
// NEW: always fetch page loads from the network
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // existing cache-first logic stays as is
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
