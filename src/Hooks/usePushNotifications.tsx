import { saveSubscription } from '@/apis/pushNotifications';
import { urlBase64ToUnit8Array } from '@/utils/pushNotifications';

const usePushNotifications = () => {
  const enablePushNotification = async () => {
    // check for notification support in the browser
    if (!('Notification' in window)) return alert('notificatins not supported'); //
    // if notification is supported then ask for permistion
    const notificationPermission = await Notification.requestPermission();
    // handle notification permission not granted
    if (notificationPermission !== 'granted')
      return alert('notifications permition not granted'); //
    // check for service worker support
    if (!('serviceWorker' in navigator))
      return alert('service worker is not supported'); //
    // regester a service worker
    const serviceWorkerRegesteration =
      await navigator.serviceWorker.register('/service.worker.js');
    // push notification permission state
    const pushNotificationState = localStorage.getItem(
      'push_notification_state',
    );
    // check if it's not null
    if (pushNotificationState !== null) return;
    // Public vapid key
    const publicVapidKey = process.env.NEXT_PUBLIC_PUBLIC_VAPID_KEY;
    // push subcription options
    const subscribeOptions: PushSubscriptionOptionsInit = {
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUnit8Array(publicVapidKey!),
    };
    // push subscription
    const subscription =
      await serviceWorkerRegesteration.pushManager.subscribe(subscribeOptions);
    // save subscription
    const response = await saveSubscription(subscription);
    // if it's true
    // // set  pushNotificationState
    if (response)
      localStorage.setItem('push_notification_state', notificationPermission);
  };
  return { enablePushNotification };
};

export default usePushNotifications;
