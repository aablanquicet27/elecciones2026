import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Registrar Service Worker para PWA con auto-actualización
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('[App] SW registrado con éxito:', registration.scope);
        
        // Verificar actualizaciones cada 60 segundos
        setInterval(() => {
          registration.update();
        }, 60000);
        
        // Detectar cuando hay un nuevo service worker esperando
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Hay una nueva versión disponible
                console.log('[App] Nueva versión disponible. Actualizando...');
                
                // Enviar mensaje al SW para que tome control inmediatamente
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                
                // Recargar la página para usar la nueva versión
                window.location.reload();
              }
            });
          }
        });
      })
      .catch((registrationError) => {
        console.log('[App] SW falló al registrarse:', registrationError);
      });
    
    // Recargar cuando el SW toma control
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        console.log('[App] Nuevo SW tomó control. Recargando...');
        window.location.reload();
      }
    });
  });
}
