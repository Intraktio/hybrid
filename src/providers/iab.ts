import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { InAppBrowser as NativeInAppBrowser } from '@ionic-native/in-app-browser';

import { Config } from './config';


@Injectable()
export class InAppBrowser {

    constructor(
        public config: Config,
        public platform: Platform,
        public iabNative: NativeInAppBrowser,
    ) { }

    create(href, target:string=null, opts:string=null) {
        if (opts === null) {
            opts = this.config.get('inAppBrowser.options', 'location=yes')
        }
        if (target === null) {
            target = this.config.get('inAppBrowser.target', '_blank');
        }
        return this.iabNative.create(href, target, opts);
    }

}

