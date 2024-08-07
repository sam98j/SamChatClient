// const NEXT_PUBLIC_API_URL = 'https://api.chat.samapps.xyz';
// const NEXT_PUBLIC_API_URL = 'http://192.168.254.78:2000';
const NEXT_PUBLIC_API_URL = 'https://samchat.onrender.com';
// caches name
const cacheName = 'v1';
// assets
const assets = [
  '/ar/chats',
  'https://fonts.googleapis.com/css2?family=Baloo+Bhaijaan+2:wght@400;600;800&family=Rubik:ital,wght@0,300;0,500;1,700&display=swap',
];

const urlBase64ToUnit8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};
const saveSubscription = async (access_token, subscription) => {
  const API_URl = NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API_URl}/users/save-subscription`, {
    method: 'post',
    headers: { 'Content-type': 'application/json', authorization: access_token },
    body: JSON.stringify(subscription),
  });

  return response.json();
};
// listen to service worker install event
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(assets)));
});
// listen for activate event
self.addEventListener('activate', async () => console.log('activated'));

self.addEventListener('push', (e) => {
  console.log('push');
  const { senderImg, senderName, msgText } = e.data.json();
  self.registration.showNotification(senderName, {
    body: msgText,
    icon: `${NEXT_PUBLIC_API_URL}${senderImg}`,
  });
});

self.addEventListener('message', async (e) => {
  if (e.data.action !== 'access_token') return;
  // jwt token
  const access_token = e.data.value;
  const PUBLIC_VAPID_KEY = 'BLtXuyohy-TNHkRgrHWMmNISkuO4p4yvHMViO4zPfuaH1RsAxboqRjQVm7XnbWGAJw5ovjNuuWOyjvzhFN86EEE';
  const subscription = await self.registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUnit8Array(PUBLIC_VAPID_KEY),
  });
  const response = await saveSubscription(access_token, subscription);
  console.log(response);
});

// fetch event
self.addEventListener('fetch', (e) => {
  // console.log('network fetch', e);
});
