import { Injectable, Injector } from '@angular/core';
import { Platform } from 'ionic-angular';

import { Config } from '../config';

import { IPushNotifications } from './interface';
import { PushNotificationsForWordPress } from './push-notifications-for-wordpress';
import { OneSignalPushNotifications } from './onesignal';
import debug from 'debug';

export * from './push-notifications-for-wordpress';
export * from './onesignal';

const log = debug('PushNotifications');

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
        public injector: Injector,
        public platform: Platform
    ) {
        const enabled = this.config.getPushNotifications('enabled', false);
        if (!enabled) {
            console.warn('Push notifications not enabled.');
            return;
        }
        this.selectPushNotificationsInstance(this.config.getPushNotifications('plugin', 'onesignal'));
    }

    selectPushNotificationsInstance(plugin: string) {
        log(`Selected: ${plugin}`);
        switch (plugin) {
            case 'onesignal':
                if (this.platform.is('cordova')) {
                    this.instance = this.injector.get(OneSignalPushNotifications);
                }
                else {
                    console.warn('OneSignal not usable. Requires platform \'cordova\'');
                }
            break;
            case 'push-notifications-for-wordpress':
                this.instance = this.injector.get(PushNotificationsForWordPress);
            break;
            default:
                throw new Error(`[PushNotifications] plugin "${plugin}" does not exists`);
        }
    }

    init() {
        if (!this.instance) {
            console.warn('Could not enable push notifications.');
            return;
        }
        this.instance.init();
    }
}
