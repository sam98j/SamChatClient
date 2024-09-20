// const NEXT_PUBLIC_API_URL = 'https://api.chat.samapps.xyz';
// const NEXT_PUBLIC_API_URL = 'http://192.168.231.78:2000';
const NEXT_PUBLIC_API_URL = 'https://samchat.onrender.com';
// url
const API_URl = NEXT_PUBLIC_API_URL;

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

self.addEventListener('notificationclick', async (e) => {
  e.notification.close();
  // e.waitUntil(
  const clientsList = await clients.matchAll({
    type: 'window',
    includeUncontrolled: true,
  });
  // loop throw clients List
  clientsList.map((client) => {
    console.log(client);
    if (
      client.url.includes('/chats') ||
      (client.url.includes('/ar/chats') && 'focus' in client)
    ) {
      return client.focus();
    }
    if (clients.openWindow) {
      return clients.openWindow('/chat?id=' + e.notification.data);
    }
  });
  console.log(clientsList);
  // .then((clientList) => {
  //   console.log(clientList);
  //   // Check if the PWA is already open and focus it
  //   for (var i = 0; i < clientList.length; i++) {
  //     var client = clientList[i];
  //     if (
  //       client.url.includes('/chats') ||
  //       (client.url.includes('/ar/chats') && 'focus' in client)
  //     ) {
  //       return client.focus();
  //     }
  //   }
  //   // If the PWA is not open, open a new window
  //   if (clients.openWindow) {
  //     return clients.openWindow('/chat?id=' + e.notification.data);
  //   }
  // });
  // );
});
