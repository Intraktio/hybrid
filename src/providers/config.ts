import { Injectable } from '@angular/core';
import deepExtend from 'deep-extend';
import _get from 'lodash/get';
import debug from 'debug';

import defaultConfig from '../config.default.cson';

const configOverwrite = require(`${__CONFIG_FOLDER__}/config.cson`);
//const devConfigOverwrite = __DEV__ ? require(`${__CONFIG_FOLDER__}/config.dev.cson`) : {};
const devConfigOverwrite = {};

const log = debug('Config');

const rawConfig = deepExtend(defaultConfig, configOverwrite, devConfigOverwrite);

@Injectable()
export class Config {
    static getConfig() { return rawConfig };
    private config: Object = rawConfig;
    constructor() {
        if (!localStorage.getItem('debug')){
            localStorage.setItem('debug', this.getDev('log'));
        }
        log('app config', this.config);
    }
    getRaw = () => this.config;
    get = (path = '', otherwise = undefined) => _get(this.config, path, otherwise);
    getDev = (path = '', otherwise = undefined) => this.get(`dev.${path}`, otherwise);
    getApi = (path = '', otherwise = undefined) => this.get(`api.${path}`, otherwise);
    getMenu = (path = '', otherwise = undefined) => this.get(`menu.${path}`, otherwise);
    getNative = (path = '', otherwise = undefined) => this.get(`native.${path}`, otherwise);
    getToast = (path = '', otherwise = undefined) => this.get(`toast.${path}`, otherwise);
    getTabs = (path = '', otherwise = undefined) => this.get(`tabs.${path}`, otherwise);
    getSearch = (path = '', otherwise = undefined) => this.get(`search.${path}`, otherwise);
    getStatusBar = (path = '', otherwise = undefined) => this.get(`statusBar.${path}`, otherwise);
    getItemComponent = (path = '', otherwise = undefined) => this.get(`components.item.${path}`, otherwise);
    getListComponent = (path = '', otherwise = undefined) => this.get(`components.list.${path}`, otherwise);
    getPushNotifications = (path = '', otherwise = undefined) => this.get(`pushNotifications.${path}`, otherwise);
}
