import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal';

import { Config } from '../config';

import { IPushNotifications } from './interface';
import debug from 'debug';

const log = debug('OneSignalPushNotifications');

@Injectable()
export class OneSignalPushNotifications implements IPushNotifications {
	constructor(
        	public config: Config,
		private oneSignal: OneSignal
	) {
	}
	init() {
		log('init');
		this.oneSignal.startInit(
			this.config.getPushNotifications('onesignal.appId'),
			this.config.getPushNotifications('android.senderID')
		);
		this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
		this.oneSignal.handleNotificationReceived().subscribe(() => {
			// do something when notification is received
		});
		this.oneSignal.handleNotificationOpened().subscribe(() => {
			// do something when a notification is opened
		});
		this.oneSignal.endInit();
	}
	hasPermission() {
		return this.oneSignal.getPermissionSubscriptionState();
	}
	register() {
		this.oneSignal.registerForPushNotifications();
		this.oneSignal.setSubscription(true);
	}
	unregister() {
		this.oneSignal.setSubscription(false);
	}
	setTags(tags: any) {
		this.oneSignal.sendTags(tags);
	}
}





