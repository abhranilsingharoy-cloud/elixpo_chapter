const CACHE_NAME = 'elixpo-art-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/CSS/homepages/elixpo_art_homepage_general.css',
  '/CSS/homepages/redirectBtns.css',
  '/CSS/homepages/elixpo_art_features.css',
  '/CSS/homepages/elixpo_project_showcase.css',
  '/CSS/homepages/elixpo_information.css',
  '/CSS/homepages/elixpo_information_enhanced.css',
  '/CSS/enhanced/pro_landing_style.css',
  '/JS/PatchContextMenu.js',
  '/JS/linkRedirect.js',
  '/JS/particles.min.js',
  '/JS/homepage/asciiArtGen.js',
  '/JS/homepage/homepageParticle.js',
  '/JS/homepage/homepageGeneral.js',
  '/JS/pwa-init.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event - cache resources
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Service Worker: Cache failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // If there's a cached response, return it
        if (response) {
          console.log('Service Worker: Serving from cache', event.request.url);
          return response;
        }

        // Otherwise, fetch from network and cache for future use
        return fetch(event.request)
          .then(networkResponse => {
            // If the response is invalid, don't cache it
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Clone the response to avoid stream consumption
            const responseToCache = networkResponse.clone();

            // Open the cache and store the response
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache)
                  .catch(error => {
                    console.error('Service Worker: Failed to cache', event.request.url, error);
                  });
              });

            return networkResponse;
          })
          .catch(() => {
            // If network fails, serve offline page for HTML requests
            if (event.request.destination === 'document') {
              return caches.match('/offline.html');
            }

            // Handle other types of failed requests here (like API)
            return new Response('Network error occurred, and no offline page is available', {
              status: 408,
              statusText: 'Request Timeout'
            });
          });
      })
  );
});

// Background sync (if used in future)
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync triggered');
    // Handle background sync logic here
  }
});

// Push notification handling
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification click received');
  
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});
