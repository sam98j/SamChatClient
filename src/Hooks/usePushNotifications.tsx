const usePushNotifications = () => {
  const enablePushNotification = async () => {
    // check for notification support in the browser
    if (!('Notification' in window)) return; // TODO handle notification not supported error
    // if notification is supported then ask for permistion
    const notificationPermission = await Notification.requestPermission();
    // handle notification permission not granted
    if (notificationPermission !== 'granted') return; // TODO handle notification permission not granted
    // check for service worker support
    if (!('serviceWorker' in navigator)) return; // TODO handle service worker not supported
    // regester a service worker
    // TODO handle service worker regesteration failure
    const serviceWorkerRegesteration = await navigator.serviceWorker.register('/service.worker.js');
    // check for active service worker
    if (!serviceWorkerRegesteration.active) return;
    // send access token to the service worker
    serviceWorkerRegesteration.active.postMessage({ action: 'access_token', value: localStorage.getItem('access_token') });
  };
  return { enablePushNotification };
};

export default usePushNotifications;
