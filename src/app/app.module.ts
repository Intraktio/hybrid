import { NgModule, ErrorHandler, APP_INITIALIZER, LOCALE_ID, Injector } from '@angular/core';
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
import { AppVersion } from '@ionic-native/app-version';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Network } from '@ionic-native/network';

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
import { PAGES, DeepLinkerLnks } from '../pages';
import { PROVIDERS, Config, Storage as OwnStorage, } from '../providers';
import { PIPES } from '../pipes';

import { AuthenticationService } from "../services/authentication";
import { NetworkNotifierService } from "../services/network-notifier";

function getUserLanguage(config: Config, translate: TranslateService = null) {
  const language = config.get('language');
  if (translate !== null) {
    const browserLanguage = translate.getBrowserLang()
    const defaultLanguage = language.default || browserLanguage || 'en';
    translate.setDefaultLang(defaultLanguage);
    return defaultLanguage;
  }
  return language.default || 'en';
}

// AoT requires an exported function for factories
export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './build/i18n/', '.json');
}

export function WpApiLoaderFactory(http: any, config: Config) {
  return new WpApiStaticLoader(http, config.getApi('baseUrl', ''), config.getApi('namespace', ''));
}

export function provideStorage() {
  return new Storage({ name: '__wphc' });
}

export function appInitializerStorageFactory(storage: OwnStorage) {
  return function () {
    return storage.init();
  };
};

export function localeIdFactory(config: Config) {
  return getUserLanguage(config);
}

export function appInitializerTranslateFactory(translate: TranslateService, injector: Injector, config: Config) {
  return () => new Promise<any>((resolve: any) => {
    const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
    locationInitialized.then(() => {
      const userLanguage = getUserLanguage(config);
      translate.use(userLanguage).subscribe(() => {
        console.info(`Successfully initialized '${userLanguage}' language.'`);
      }, err => {
        console.error(`Problem with '${userLanguage}' language initialization.'`);
      }, () => {
        resolve(null);
      });
    });
  });
};

export function appInitializerAuthenticationFactory(auth: AuthenticationService) {
  return function () {
    auth.isAuthenticated();
  }
}

export function appInitializerNetworkFactory(network: NetworkNotifierService) {
  return function () {
    network.listenNetworkChanges();
  }
}

@NgModule({
  declarations: [...COMPONENTS, ...PAGES, WPHC, ...PIPES, ...DIRECTIVES],
  imports: [
    BrowserModule,
    HttpModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(WPHC, {}, {
      links: DeepLinkerLnks
    }),
    ...STORE,
    WpApiModule.forRoot({
      provide: WpApiLoader,
      useFactory: (WpApiLoaderFactory),
      deps: [Http, Config]
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    }),
    MomentModule,
    ServiceWorkerModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [...COMPONENTS, ...PAGES, WPHC],
  providers: [
    // Storage,
    ...PROVIDERS,
    StatusBar,
    SplashScreen,
    Push,
    Toast,
    OneSignal,
    AppVersion,
    InAppBrowser,
    Network,
    { provide: Storage, useFactory: provideStorage },
    // { provide: Settings, useFactory: provideSettings, deps: [ Storage ] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: LOCALE_ID, useFactory: localeIdFactory, deps: [Config] },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerStorageFactory,
      deps: [OwnStorage],
      multi: true
    }, {
      provide: APP_INITIALIZER,
      useFactory: appInitializerTranslateFactory,
      deps: [TranslateService, Injector, Config],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerAuthenticationFactory,
      deps: [AuthenticationService],
      multi: true
    },{
      provide: APP_INITIALIZER,
      useFactory: appInitializerNetworkFactory,
      deps: [ NetworkNotifierService ],
      multi: true
    },
    AuthenticationService,
    NetworkNotifierService
  ]
})
export class AppModule { }
