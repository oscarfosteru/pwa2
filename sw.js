const STATIC_CACHE_NAME = 'static-cache-v1.1';
const INMUTABLE_CACHE_NAME = 'inmutable-cache-v1.1';
const DYNAMIC_CACHE_NAME = 'dynamic-cache-v1.1';





const currentCache = 'current-cache-v1.3';
const dynamicCache = 'dynamic-cache-v1.1';

const files =
[
            '/',
            '/index.html',
            '/js/app.js',
            '/manifest.json',
            '/index3.html',
            '/pages/offline.html',
            '/images/error.png',
            '/images/perrito.jpg',
            '/images/perrito2.jpg',
            '/pages/recent.html',
            '/images/icons/android-launchericon-144-144.png',
            '/images/icons/android-launchericon-192-192.png',
            '/images/icons/android-launchericon-48-48.png',
            '/images/icons/android-launchericon-512-512.png',
            '/images/icons/android-launchericon-72-72.png',
            '/images/icons/android-launchericon-96-96.png'

];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(currentCache).then(cache => {
      return cache.addAll(files);
    })
  );
});



self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => Promise.all(
      cacheNames.filter(cacheName => {
        return cacheName !== currentCache
      }).map(cacheName => caches.delete(cacheName))
    ))
  );
});






self.addEventListener("fetch", function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request).then(function(response) {
        return response || caches.match("/offline.html");
      });
    })
  );
});






const cleanCache = (cacheName, limitItems) => {
  caches.open(cacheName).then((cache) => {
    return cache.keys().then((keys) => {
      if (keys.length > limitItems) {
        cache.delete(keys[0]).then(cleanCache(cacheName, limitItems));
      }
    });
  });
};



import {getAllMovies} from "/js/datos.js"

const staleWhileRevalidate = (event) => {
  event.respondWith(
    caches.match(event.request).then((cacheResponse) => {
      if (cacheResponse) {
        fetch(event.request).then((networkResponse) => {
          return caches.open(dynamicCache).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          })
        });
        return cacheResponse;
      } else {
        return fetch(event.request).then((networkResponse) => {
          return caches.open(dynamicCache).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          })
        });
      }
    })
  );
 };


