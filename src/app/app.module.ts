import { NgModule, ErrorHandler, APP_INITIALIZER, Injector } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LOCATION_INITIALIZED } from '@angular/common';
import { ServiceWorkerModule } from '@angular/service-worker';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push } from '@ionic-native/push';
import { Toast } from '@ionic-native/toast';
import { Storage } from '@ionic/storage';
import { OneSignal } from '@ionic-native/onesignal';

import {
  WpApiModule,
  WpApiLoader,
  WpApiStaticLoader
} from 'wp-api-angular'
import { MomentModule } from 'angular2-moment';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import '../i18n';
import { WPHC } from './app.component';
import { STORE } from '../store';
import { COMPONENTS, DIRECTIVES } from '../components';
import { PAGES, PageMODULES } from '../pages';
import { PROVIDERS, Config, Storage as OwnStorage, } from '../providers';
import { PIPES } from '../pipes';

import * as ionicConfig from './config/app.config.ionic';
import { AuthenticationService } from "../services/authentication";

import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [WPHC],
  imports: [
    BrowserModule,
    SharedModule,
    IonicModule.forRoot(WPHC, ionicConfig.config),
  ],
  bootstrap: [IonicApp],
  entryComponents: [WPHC],
})
export class AppModule { }
