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
    tag: chatMessage._id,
    body: chatMessage.type === 'TEXT' ? chatMessage.content : 'رسالة صوتية',
    icon: `${NEXT_PUBLIC_API_URL}${chatMessage.sender.avatar}`,
    badge: '/favicon/android-chrome-512x512.png',
    data: chatMessage.receiverId,
  });
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(function (clientList) {
        // Check if the PWA is already open and focus it
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if (client.url === '/chats' && 'focus' in client) {
            return client.focus();
          }
        }
        // If the PWA is not open, open a new window
        if (clients.openWindow) {
          return clients.openWindow('/chat?id=' + e.notification.data);
        }
      }),
  );
});
