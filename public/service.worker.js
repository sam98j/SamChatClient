const NEXT_PUBLIC_API_URL = 'http://api.chat.samapps.xyz';
// const NEXT_PUBLIC_API_URL = 'http://192.168.48.78:2000';

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
  console.log(access_token);

  //   console.log(access_token);
  const API_URl = NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API_URl}/users/save-subscription`, {
    method: 'post',
    headers: { 'Content-type': 'application/json', authorization: access_token },
    body: JSON.stringify(subscription),
  });

  return response.json();
};

// listen to service worker install event
self.addEventListener('install', () => console.log('service worker installed succ'));
// listen for activate event
self.addEventListener('activate', async () => console.log('activated'));

self.addEventListener('push', (e) => {
  const { senderImg, senderName, msgText } = e.data.json();
  self.registration.showNotification(senderName, {
    body: msgText,
    icon: `${NEXT_PUBLIC_API_URL}${senderImg}`,
  });
});

self.addEventListener('message', async (e) => {
  console.log('message event ');
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
