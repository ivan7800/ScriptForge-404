const CACHE_NAME = 'scriptforge-404-v5-6-auto-uac-final';
const CORE_ASSETS = [
  './',
  './index.html',
  './apps-corporativas.html',
  './favicon.svg',
  './site.webmanifest',
  './assets/css/styles.css',
  './assets/js/storage.js',
  './assets/js/security.js',
  './assets/js/templates.js',
  './assets/js/templates-extra.js',
  './assets/js/templates-cau-mega.js',
  './assets/js/templates-v5-pro.js',
  './assets/js/templates-v5-4-pro.js',
  './assets/js/generator.js',
  './assets/js/exporter.js',
  './assets/js/app.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response && response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
