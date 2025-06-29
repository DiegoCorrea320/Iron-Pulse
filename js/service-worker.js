const CACHE_NAME = 'iron-pulse-cache-v1';
const urlsToCache = [
  '/',
  '/html/index.html',
  '/html/login.html',
  '/html/register.html',
  '/css/styles.css',
  '/js/auth.js',
  '/js/dashboard.js',
  '/manifest.json',
  '/img/icon-192.png',
  '/img/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
