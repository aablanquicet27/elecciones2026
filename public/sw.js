// Service Worker para PWA - Elecciones Colombia 2026
// Versión dinámica basada en timestamp para forzar actualizaciones
const CACHE_VERSION = 'v' + new Date().getTime();
const CACHE_NAME = 'elecciones-2026-' + CACHE_VERSION;

// Assets estáticos que queremos cachear
const STATIC_ASSETS = [
  '/logoagapai.png',
  '/Logo AG Illuminado en Neo Púrpura (1) (1) (2) (1) (1).svg',
  '/visualizations/intencion_voto_real_2026.png',
  '/visualizations/tendencias_politicas_real_2026.png',
  '/visualizations/evolucion_historica_real_2026.png',
  '/visualizations/comparacion_encuestadoras_real_2026.png'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando nueva versión:', CACHE_NAME);
  
  // Forzar que el nuevo SW tome control inmediatamente
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Cache abierto:', CACHE_NAME);
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.error('[SW] Error al cachear assets:', error);
      })
  );
});

// Activar Service Worker y limpiar cachés viejos
self.addEventListener('activate', (event) => {
  console.log('[SW] Activando nueva versión:', CACHE_NAME);
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Eliminar todos los cachés que no sean el actual
          if (cacheName.startsWith('elecciones-2026-') && cacheName !== CACHE_NAME) {
            console.log('[SW] Eliminando caché viejo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Tomar control de todas las páginas inmediatamente
      return self.clients.claim();
    })
  );
});

// Estrategia de caché: Network First para HTML/JS/CSS, Cache First para imágenes
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Ignorar requests que no sean del mismo origen (APIs externas, etc.)
  if (url.origin !== location.origin) {
    return;
  }
  
  // Determinar estrategia según el tipo de recurso
  const isNavigationRequest = event.request.mode === 'navigate';
  const isAssetRequest = /\.(js|css|html)$/i.test(url.pathname);
  const isImageRequest = /\.(png|jpg|jpeg|svg|gif|webp)$/i.test(url.pathname);
  
  if (isNavigationRequest || isAssetRequest) {
    // NETWORK FIRST para HTML, JS, CSS (siempre intenta obtener la versión más reciente)
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cachear la nueva versión
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Si falla la red, usar caché como fallback
          return caches.match(event.request);
        })
    );
  } else if (isImageRequest) {
    // CACHE FIRST para imágenes (más eficiente)
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request).then((response) => {
            if (response && response.status === 200) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return response;
          });
        })
    );
  }
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

// Mensaje para forzar actualización desde la app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
