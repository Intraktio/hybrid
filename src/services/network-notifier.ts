import { Network } from '@ionic-native/network';
import { Injectable } from "@angular/core";
import { AlertController, Alert } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Toast } from '../providers/toast'
import debug from 'debug';

const log = debug('NetworkNotifierService');

@Injectable()
export class NetworkNotifierService {

    isOffline: boolean = false;
    networkLostAlert: Alert = null;

    constructor(
        public alertCtrl: AlertController,
        private network: Network,
        private translate: TranslateService,
        private toast: Toast
    ) {
    }

    listenNetworkChanges() {
        this.network.onDisconnect().subscribe(() => {
            this.isOffline = true;
            this.presentNetworkLostAlert();
        });
        this.network.onConnect().subscribe(() => {
            this.isOffline = false;
            this.dismissNetworkLostAlert();
            this.toast.show(this.translate.instant('RECONNECTED_TO_INTERNET'));
            // We just got a connection but we need to wait briefly
            // before we determine the connection type. Might need to wait
            // prior to doing any api requests as well.
            setTimeout(() => {
                log('network type is ' + this.network.type);
            }, 3000);
        });
    }

    dismissNetworkLostAlert() {
        if (this.networkLostAlert !== null) {
            this.networkLostAlert.dismiss();
            this.networkLostAlert = null;
        }
    }

    presentNetworkLostAlert() {
        this.networkLostAlert = this.alertCtrl.create({
            title: this.translate.instant('NO_INTERNET_CONNECTION'),
            subTitle: this.translate.instant('CONNECTION_LOST_INFO_TEXT'),
            enableBackdropDismiss: false,
            buttons: [ {
                text: this.translate.instant('RETRY'),
                handler: () => {
                    if (this.isOffline) {
                        this.presentNetworkLostAlert();
                    }
                }
            }]
        });
        this.networkLostAlert.present();
    }

}
