import { AppState } from "../reducers/index";
import { Store } from "@ngrx/store";
import { Observable } from 'rxjs';
import { Injectable } from "@angular/core";
import { WpApiUsers, WpApiAuth } from "wp-api-angular";
import { setAuthentication } from './../actions';
import _get from 'lodash/get';
import debug from 'debug';

const log = debug('AuthenticationService');

@Injectable()
export class AuthenticationService {

    constructor(
        private store: Store<AppState>,
        private wpApiUsers: WpApiUsers,
        private wpApiAuth: WpApiAuth,
    ) {}

    getAuthenticationState() {
        return this.store.select('authentication');
    }

    setAuthenticationState(details) {
        return this.store.dispatch(setAuthentication(details));
    }

    isAuthenticated() {
        return this.getAuthenticationState()
            .take(1)
            .flatMap(state => {
                return this.validateAuthentication()
                    .catch((error: any) => {
                        return Observable.throw(error.json().message);
                    })
            })
            .subscribe(resp => {
                log('resp', resp);
                this.setAuthenticationState({token: resp.token, authenticated: true});
            }, error => {
                log('error', error);
                this.signout();
            })
    }
    validateAuthentication() {
        return this.wpApiAuth.validate()
            .map(resp => resp.json());
    }

    signout() {
        this.wpApiAuth.removeSession();
        this.setAuthenticationState({token: null, authenticated: false});
    }

}
