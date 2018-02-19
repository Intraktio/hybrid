import { AppState } from "../reducers/index";
import { Store } from "@ngrx/store";
import { Injectable } from "@angular/core";
import { WpApiUsers } from "wp-api-angular";
import { setAuthentication } from './../actions';
import _get from 'lodash/get';

@Injectable()
export class AuthenticationService {

    constructor(
        private store: Store<AppState>,
        private wpApiUsers: WpApiUsers,
    ) {}

    getAuthenticationState() {
        return this.store.select('authentication').take(1);
    }

    setAuthenticationState(details) {
        return this.store.dispatch(setAuthentication(details));
    }

}
