const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const urlBase64ToUnit8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};
const saveSubscription = async (subscription: PushSubscription) => {
  const response = await fetch(`${apiUrl}/users/save-subscription`, {
    method: 'post',
    headers: {
      'Content-type': 'application/json',
      authorization: localStorage.getItem('access_token')!,
    },
    body: JSON.stringify(subscription),
  });
  return response.json();
};
const usePushNotifications = () => {
  const enablePushNotification = async () => {
    // check for notification support in the browser
    if (!('Notification' in window)) return alert('notificatins not supported'); // TODO handle notification not supported error
    // if notification is supported then ask for permistion
    const notificationPermission = await Notification.requestPermission();
    // handle notification permission not granted
    if (notificationPermission !== 'granted')
      return alert('permition not granted'); // TODO handle notification permission not granted
    // check for service worker support
    if (!('serviceWorker' in navigator))
      return alert('service worker is not supported'); // TODO handle service worker not supported
    // regester a service worker
    // TODO handle service worker regesteration failure
    const serviceWorkerRegesteration =
      await navigator.serviceWorker.register('/service.worker.js');
    // push notification permission state
    // const pushNotificationState = localStorage.getItem(
    //   'push_notification_state',
    // );
    // check if it's not null
    // if (pushNotificationState !== null) return;
    // // // set  pushNotificationState
    // localStorage.setItem('push_notification_state', notificationPermission);
    const PUBLIC_VAPID_KEY =
      'BLtXuyohy-TNHkRgrHWMmNISkuO4p4yvHMViO4zPfuaH1RsAxboqRjQVm7XnbWGAJw5ovjNuuWOyjvzhFN86EEE';
    const subscribtion = await serviceWorkerRegesteration.pushManager.subscribe(
      {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUnit8Array(PUBLIC_VAPID_KEY),
      },
    );
    saveSubscription(subscribtion);
  };
  return { enablePushNotification };
};

export default usePushNotifications;
