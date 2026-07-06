const CACHE_NAME = 'hospital-data-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/entry.html',
  '/delete_data.html',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/chart.js',
  '/icon-128x128.png',
  '/icon-144x144.png',
  '/icon-152x152.png',
  '/icon-192x192.png',
  '/icon-256x256.png',
  '/icon-512x512.png'
];

// Install Service Worker
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activate Service Worker
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Fetch Requests
self.addEventListener('fetch', (e) => {
  // Firebase Realtime Database மற்றும் CDN கோரிக்கைகளைத் தவிர்த்து மற்றவற்றை கேச் செய்யும்
  if (e.request.url.includes('firebaseio.com')) {
    return fetch(e.request);
  }
  
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
