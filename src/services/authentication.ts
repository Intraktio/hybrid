import { AppState } from "../reducers/index";
import { Store } from "@ngrx/store";
import { Injectable } from "@angular/core";
import { WpApiUsers } from "wp-api-angular";
import { authenticationReducer } from "../reducers/authentication";
import { setAuthentication } from './../actions';
import _get from 'lodash/get';

@Injectable()
export class AuthenticationService {

    constructor(
        private store: Store<AppState>,
        private wpApiUsers: WpApiUsers,
    ) {}

    getAuthenticationState() {
        return this.store.select(state => {
            let item = _get(state, 'authentication');
            if (!item) {
                item = authenticationReducer();
            }
            return item;
        }).take(1);
    }

    /**
     * Authenticates the current user and returns a resolved promise upon success and a rejected promise upon failure.
     */
    authenticate() {
        return this.wpApiUsers
            .me()
            .toPromise()
            .then(response => response.json())
            .then(response => {
                console.log(response);
                //this.store.dispatch(setAuthentication());
                return response;
            })
    }

}
