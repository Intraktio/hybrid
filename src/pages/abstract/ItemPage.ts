import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { isNumeric } from "rxjs/util/isNumeric";
import { Refresher, NavParams } from 'ionic-angular';
import { URLSearchParams } from '@angular/http';
import { Injector } from '@angular/core';
import _get from 'lodash/get';

import { Toast, Config } from './../../providers';

export interface IItemPage {
    onLoad(data: Object): void;
    onClean(): void;
}

export class AbstractItemPage {
    // Injections
    config: Config;
    navParams: NavParams;
    toast: Toast;
    translate: TranslateService;

    init: boolean = false;
    fetched: false;
    shouldRetry: boolean = false;
    stream$: Observable<any>;
    service: any;
    type: string;
    title: string;

    constructor(
        public injector: Injector
    ) {
        this.config = injector.get(Config, Config);
        this.navParams = injector.get(NavParams, NavParams);
        this.toast = injector.get(Toast, Toast);
        this.translate = injector.get(TranslateService, TranslateService);
    }

    ionViewDidLoad() {
        console.log('[ItemPage] init');
        let isItemLoaded;
        this.stream$.take(1).subscribe(item => isItemLoaded = item !== undefined && item._needsRefresh !== true);
        if (!isItemLoaded) {
            this.doLoad();
        } else {
            this.init = true;
        }
    }

    setStream = (stream: Observable<any>) => this.stream$ = stream;
    setService = (service: any) => this.service = service;
    setType = (type: string) => this.type = type;
    setTitle = (title: string) => this.title = title;

    onLoad(data: Object) { }

    private getQuery(): Object {
        return Object.assign(
            {},
            this.config.get(`[${this.type}].query`, {}),
            _get(this.navParams.get('options'), 'query', {})
        );
    }

    private fetch(): Observable<any> {
        const searchParams = Object.assign({}, this.getQuery(), {
            "_embed": true
        });
        const uRLSearchParams = new URLSearchParams();
        Object.keys(searchParams).map((key) => {
            uRLSearchParams.set(key, searchParams[key]);
        });

        console.log(`[ItemPage] fetch ${this.type}`, searchParams);
        return (() => {
            if (isNumeric(this.navParams.get('id'))) {
                return this.service.get(this.navParams.get('id'), { search: uRLSearchParams })
            }
            else {
                let slug = this.navParams.get('id');
                uRLSearchParams.set('slug', slug);
                uRLSearchParams.set('per_page', '1');
                uRLSearchParams.set('full', '1');
                return this.service.getList({ search: uRLSearchParams })
            }
        })()
            .debounceTime(this.config.getApi('debounceTime', 400))
            .timeout(this.config.getApi('timeout', 10000))
            .retry(this.config.getApi('maxAttempt', 3) - 1)
            .map((r) => {
                this.init = true;
                this.shouldRetry = false;
                let json = r.json();
                if (json instanceof Array) {
                    json = json[0];
                }
                this.navParams.data['id'] = json.id;
                this.onLoad(json)
            })
            .catch(res => {
                this.init = false;
                this.shouldRetry = true;
                this.toast.show(this.translate.instant('ERROR'));
                return res;
            });
    }

    doLoad = (): void => {
        console.log('[ItemPage] doLoad');
        this.fetch().take(1).subscribe(() => { }, () => { });
    }

    doRefresh(refresher: Refresher): void {
        console.log('[ItemPage] doRefresh');
        this.fetch().take(1).subscribe(() => refresher.complete(), (error) => refresher.complete());
    }

}
