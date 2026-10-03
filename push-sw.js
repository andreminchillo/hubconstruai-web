self.addEventListener('push', (event) => {
  let payload = {};

  if (event.data) {
    try {
      const parsedPayload = event.data.json();
      payload = parsedPayload && typeof parsedPayload === 'object' ? parsedPayload : {};
    } catch (error) {
      payload = {};
    }
  }

  const title = typeof payload.title === 'string' && payload.title ? payload.title : 'Notificação';
  const body = typeof payload.body === 'string' ? payload.body : '';
  const url = typeof payload.url === 'string' && payload.url ? payload.url : '/';

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      data: { url },
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const data = event.notification.data && typeof event.notification.data === 'object' ? event.notification.data : {};
  const url = typeof data.url === 'string' && data.url ? data.url : '/';
  const targetUrl = new URL(url, self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client && client.url === targetUrl) {
          return client.focus();
        }
      }

      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }

      return undefined;
    })
  );
});
