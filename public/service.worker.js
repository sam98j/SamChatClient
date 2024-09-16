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
  console.log('push');
  const { senderImg, senderName, msgText } = e.data.json();
  self.registration.showNotification(senderName, {
    body: msgText,
    icon: `${NEXT_PUBLIC_API_URL}${senderImg}`,
    badge: '/favicon/android-chrome-512x512.png',
  });
});
