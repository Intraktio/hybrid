import { AppState } from "../reducers/index";
import { Store } from "@ngrx/store";
import { Injectable } from "@angular/core";
import { WpApiUsers } from "wp-api-angular";
import { AuthenticationState } from "../reducers/authentication";
import { setAuthentication } from './../actions';

@Injectable()
export class AuthenticationService {

    constructor(
        private store: Store<AppState>,
        private wpApiUsers: WpApiUsers,
    ) {}

    getAuthenticationState() {
        return this.store.select('authentication').take(1);
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
