// Service Worker for Al-Saabri Investment Management
const CACHE_NAME = 'al-saabri-investment-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/main.js',
  '/preload.js',
  '/manifest.json',
  
  // CSS files
  '/analytics-css.css',
  '/navigation-styles.css',
  '/notification-styles.css',
  '/central-notification-styles.css',
  '/comprehensive-backup-styles.css',
  
  // JavaScript files
  '/analytics-code.js',
  '/firebase-integration.js',
  '/notification-enhancements.js',
  '/navigation-enhancements.js',
  '/chart-utils.js',
  '/app-enhancements.js',
  
  // Assets
  '/assets/app-icon.png',
  '/assets/app-icon.svg',
  '/assets/IraqiInvestmentIcon.ico',
  '/icon.ico',
  
  // External resources
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js',
  
  // Firebase
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js',
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js',
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-storage.js',
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js'
];

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Service Worker: Cache installation failed', error);
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests and non-GET requests
  if (!event.request.url.startsWith(self.location.origin) && !event.request.url.startsWith('https://cdnjs.cloudflare.com') && !event.request.url.startsWith('https://www.gstatic.com')) {
    return;
  }
  
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          console.log('Service Worker: Serving from cache', event.request.url);
          return response;
        }
        
        console.log('Service Worker: Fetching from network', event.request.url);
        return fetch(event.request).then((response) => {
          // Don't cache if not a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // Return offline fallback for HTML pages
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});

// Background sync for data synchronization
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'investment-data-sync') {
    event.waitUntil(
      syncInvestmentData()
    );
  }
});

// Push notification handler
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'إشعار جديد من نظام إدارة الاستثمار',
    icon: '/assets/app-icon.png',
    badge: '/assets/app-icon.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/index.html'
    },
    actions: [
      {
        action: 'open',
        title: 'فتح التطبيق',
        icon: '/assets/icons/128x128/temp.svg'
      },
      {
        action: 'close',
        title: 'إغلاق',
        icon: '/assets/icons/128x128/temp.svg'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('إدارة الاستثمار السعبري', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event.action);
  
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/index.html')
    );
  }
});

// Helper function for data synchronization
async function syncInvestmentData() {
  try {
    console.log('Service Worker: Syncing investment data...');
    
    // This would typically sync with Firebase or your backend
    const response = await fetch('/api/sync-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      console.log('Service Worker: Data sync successful');
      
      // Notify the main app about successful sync
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({
          type: 'SYNC_SUCCESS',
          timestamp: Date.now()
        });
      });
    }
  } catch (error) {
    console.error('Service Worker: Data sync failed', error);
  }
}

// Message handler for communication with main app
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'REQUEST_SYNC') {
    self.registration.sync.register('investment-data-sync');
  }
});