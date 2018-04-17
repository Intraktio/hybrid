import { Network } from '@ionic-native/network';
import { Injectable } from "@angular/core";
import { AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import debug from 'debug';

const log = debug('NetworkNotifierService');

@Injectable()
export class NetworkNotifierService {

    isOffline: boolean = false;

    constructor(
        public alertCtrl: AlertController,
        private network: Network,
        private translate: TranslateService
    ) {}

    ngOnInit() {
        this.listenNetworkChanges();
    }

    listenNetworkChanges() {
        this.network.onDisconnect().subscribe(() => {
            console.log('network disconnected');
            this.isOffline = true;
            this.showNetworkLostAlert();
        });
        this.network.onConnect().subscribe(() => {
            console.log('network connected');
            this.isOffline = false;
            // We just got a connection but we need to wait briefly
            // before we determine the connection type. Might need to wait
            // prior to doing any api requests as well.
            setTimeout(() => {
                console.log('network type is ' + this.network.type);
            }, 3000);
        });
    }

    showNetworkLostAlert() {
        this.alertCtrl.create({
            title: this.translate.instant('NO_INTERNET_CONNECTION'),
            subTitle: this.translate.instant('CONNECTION_LOST_INFO_TEXT'),
            buttons: [this.translate.instant('RETRY')]
        });
    }

}
