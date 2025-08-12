// Service Worker para PWA - Elecciones Colombia 2026
const CACHE_NAME = 'elecciones-2026-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/logoagapai.png',
  '/Logo AG Illuminado en Neo Púrpura (1) (1) (2) (1) (1).svg',
  '/visualizations/intencion_voto_real_2026.png',
  '/visualizations/tendencias_politicas_real_2026.png',
  '/visualizations/evolucion_historica_real_2026.png',
  '/visualizations/comparacion_encuestadoras_real_2026.png'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar requests
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - devolver respuesta
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Actualizar Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Manejar notificaciones push (opcional)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nueva actualización electoral disponible',
    icon: '/logoagapai.png',
    badge: '/logoagapai.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver análisis',
        icon: '/logoagapai.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/logoagapai.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Elecciones Colombia 2026', options)
  );
});

// Manejar clicks en notificaciones
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});