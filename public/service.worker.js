// const NEXT_PUBLIC_API_URL = 'https://api.chat.samapps.xyz';
// const NEXT_PUBLIC_API_URL = 'http://192.168.231.78:2000';
const NEXT_PUBLIC_API_URL = 'https://samchat.onrender.com';
// url
const API_URl = NEXT_PUBLIC_API_URL;

const channel = new BroadcastChannel('worker');
// listen to service worker install event
self.addEventListener('install', () => {});
// listen for activate event
self.addEventListener('activate', async () => {});
// listen for push event
self.addEventListener('push', (e) => {
  // console.log('push', Notification.requestPermission());
  const chatMessage = e.data.json();
  // channel.postMessage(chatMessage);
  self.registration.showNotification(chatMessage.sender.name, {
    tag: 'notification-tag',
    body: chatMessage.content,
    icon: `${NEXT_PUBLIC_API_URL}${chatMessage.sender.avatar}`,
    badge: '/favicon/android-chrome-512x512.png',
    data: chatMessage.receiverId,
  });
});
// listen for notification click
self.addEventListener('notificationclick', async (e) => {
  e.notification.close();
  e.waitUntil(
    clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      .then((clientsList) => {
        if (!clientsList.length)
          return clients.openWindow('/chat?id=' + e.notification.data);
        clientsList.map((client) => {
          if (
            client.url.includes('/chat?id=' + e.notification.data) &&
            'focus' in client
          ) {
            return client.focus();
          }
          client.navigate('/chat?id=' + e.notification.data);
          return client.focus();
        });
      }),
  );
});
