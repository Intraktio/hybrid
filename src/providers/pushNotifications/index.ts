import { Injectable, Injector } from '@angular/core';

import { Config } from '../config';

import { IPushNotifications } from './interface';
import { PushNotificationsForWordPress } from './push-notifications-for-wordpress';
import { OneSignalPushNotifications } from './onesignal';

/*
  Generated class for the PushNotifications provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class PushNotifications {
    instance: IPushNotifications;

    constructor(
        public config: Config,
        public injector: Injector
    ) {
        const plugin = this.config.getPushNotifications('plugin', 'onesignal');

        switch (plugin) {
            case 'onesignal':
                this.instance = this.injector.get(OneSignalPushNotifications, OneSignalPushNotifications);
            break;
            case 'push-notifications-for-wordpress':
                this.instance = this.injector.get(PushNotificationsForWordPress, PushNotificationsForWordPress);
            break;
            default:
                throw new Error(`[PushNotifications] plugin "${plugin}" does not exists`);
        }
    }

    init() {
        this.instance.init();
    }
}
