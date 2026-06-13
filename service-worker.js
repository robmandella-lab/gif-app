// Offline cache for the Video→GIF app.
// Bump CACHE_VERSION whenever you change the app's files to force an update.
const CACHE_VERSION = 'gif-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './vendor/ffmpeg.js',
  './vendor/814.ffmpeg.js',
  './vendor/util.js'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_VERSION).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  // Only serve same-origin assets from cache; let the CDN engine load normally.
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
