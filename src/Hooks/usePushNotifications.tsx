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
    const pushNotificationState = localStorage.getItem(
      'push_notification_state',
    );
    // check if it's not null
    if (pushNotificationState !== null)
      return alert('notifications alreday granted');
    // // set  pushNotificationState
    localStorage.setItem('push_notification_state', notificationPermission);
    // send access token to the service worker
    serviceWorkerRegesteration.active?.postMessage({
      action: 'access_token',
      value: localStorage.getItem('access_token'),
    });
  };
  return { enablePushNotification };
};

export default usePushNotifications;
