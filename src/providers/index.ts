import { Config } from './config';
import { Toast } from './toast';
import { Menu } from './menu';
import { Storage } from './storage';
import { ServiceWorkerProvider } from './service-worker/service-worker';
import { PushNotifications, PushNotificationsForWordPress, OneSignalPushNotifications } from './pushNotifications';
import { InAppBrowser } from './iab';

export * from './config';
export * from './toast';
export * from './menu';
export * from './storage';
export * from './service-worker/service-worker';
export * from './pushNotifications';
export * from './iab';

import {
  PROVIDERS as CustomPROVIDERS
} from '../../config/providers';

export const PROVIDERS = [
  Config,
  Toast,
  Menu,
  Storage,
  PushNotifications,
  PushNotificationsForWordPress,
  OneSignalPushNotifications,
  ServiceWorkerProvider,
  InAppBrowser,
  ...CustomPROVIDERS
];
