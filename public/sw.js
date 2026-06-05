// PassionFruits Service Worker
const CACHE_NAME = 'pf-v3';
const PRECACHE_URLS = [
  '/logo.png',
  '/manifest.json',
  '/images/PF app logo iphone.png',
];

const isCacheableAsset = (url) => (
  url.origin === self.location.origin
  && PRECACHE_URLS.includes(url.pathname)
);

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request));
    return;
  }

  const url = new URL(request.url);
  if (!isCacheableAsset(url)) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const networkResponse = fetch(request).then((response) => {
        if (response && response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        }
        return response;
      });

      return cachedResponse || networkResponse;
    })
  );
});
