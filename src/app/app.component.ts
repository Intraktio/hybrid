import { Store } from '@ngrx/store';
import { Component, ViewChild, HostListener } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import debug from 'debug';

import { AppState, IParamsState } from './../reducers';
import { Config, PushNotifications, Storage, ServiceWorkerProvider, InAppBrowser } from './../providers';
import { MenuMapping } from './../pages';

const log = debug('App');

if (__DEV__) {
  debug.enable('*');
} else {
  debug.disable();
}

/**
 * Class for proxying global window object.
 */
class Win {
  static set openIab(openIab: Function) {
    window['openIab'] = openIab;
  }
  static get openIab(): Function {
    return window['openIab'];
  }
}

@Component({
  templateUrl: 'app.html'
})
export class WPHC {
  @ViewChild(Nav) nav: Nav;
  title: string

  constructor(
    public platform: Platform,
    public store: Store<AppState>,
    public config: Config,
    public pushNotif: PushNotifications,
    public splashScreen: SplashScreen,
    public statusBar: StatusBar,
    public storage: Storage,
    public swProvider: ServiceWorkerProvider,
    public iab: InAppBrowser,
  ) {
    const appNode: any = document.querySelector('ion-app');

    this.title = config.get('title', '');

    this.platform.ready().then(() => {
      const { page, params } = this.config.get('defaultPage', {});
      log('Ready');

      this.storage.run();

      if (!location.hash && page && MenuMapping[page]) { // redirect to default page
        this.nav.setRoot(MenuMapping[page], params);
      }

      this.store.select(state => state.params).map((params: IParamsState) => {
        appNode.style = `zoom: ${0.8 + (0.1 * params.zoom)}`
      }).subscribe();

      pushNotif.init();
      swProvider.init();
      this.initStatusBar();

      setTimeout(() => { // A small delay to prevent flashing
        this.splashScreen.hide();
      }, 100);
    });
  }

  @HostListener('document:click', ['$event'])
  openLinksInAppBrowser(evt: any) {
    if (!this.config.get('inAppBrowser.defaultForLinks', false)) {
      return;
    }
    evt = evt || window.event;
    var elem = evt.target || evt.srcElement;
    while (elem) {
      if (elem.href) {
        Win.openIab(elem.href, elem.target);
        evt.preventDefault();
        return false;
      }
      elem = elem.parentNode;
    }
  }

  ngOnInit() {
    Win.openIab = (href, params:string='', opts:string=null) => this.iab.create(href, params, opts);
  }

  initStatusBar() {
    if (this.config.getStatusBar('show', false) === false) {
      this.statusBar.hide();
      return;
    }
    this.statusBar.show();
    this.setStatusBarStyle(this.config.getStatusBar('style', 'default'));
    this.statusBar.overlaysWebView(this.config.getStatusBar('overlaysWebView', true));
    let color = this.config.getStatusBar('color', null);
    if (color !== null) {
      this.statusBar.backgroundColorByHexString(color);
    }
  }

  setStatusBarStyle(name: string) {
    switch (name) {
      case 'light':
        this.statusBar.styleLightContent();
        break;
      case 'blackTranslucent':
        this.statusBar.styleBlackTranslucent();
        break;
      case 'blackOpaque':
        this.statusBar.styleBlackOpaque();
        break;
      case 'default':
      default:
        this.statusBar.styleDefault();
    }
  }

}
