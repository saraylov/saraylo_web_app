// Service Worker для улучшения работы с геолокацией

self.addEventListener('install', (event) => {
  console.log('Service Worker установлен');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker активирован');
  event.waitUntil(self.clients.claim());
});

// Обработка геолокационных запросов
self.addEventListener('fetch', (event) => {
  // Пропускаем запросы, не связанные с геолокацией
  if (!event.request.url.includes('location') && 
      !event.request.url.includes('geolocation') &&
      !event.request.url.includes('mapbox')) {
    return;
  }
  
  // Для запросов к Mapbox API разрешаем использование кэша
  if (event.request.url.includes('mapbox')) {
    event.respondWith(
      caches.open('mapbox-cache').then((cache) => {
        return cache.match(event.request).then((response) => {
          return response || fetch(event.request).then((response) => {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
  }
});