import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal';

import { IPushNotifications } from './interface';

@Injectable()
export class OneSignalPushNotifications implements IPushNotifications {
	constructor(private oneSignal: OneSignal) {
	}
	init() {
		this.oneSignal.startInit('', '');
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
	}
	unregister() {
		// void
	}
}





