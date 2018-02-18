import { ActionReducer, Action } from '@ngrx/store';
import { INIT, AUTHENTICATE, CLEAN_CACHE } from '../actions';

export interface AuthenticationState {
    token: string;
    authenticated: boolean;
}

const defaultState = {
    token: null,
    authenticated: false
}

export const authenticationReducer: ActionReducer<Object> = (state: Object = defaultState, action: Action) => {
    const payload = action.payload;

    switch (action.type) {
        case AUTHENTICATE : {
            if (payload.authenticated === undefined) {
                payload.authenticated = payload.token != null;
            }
            return Object.assign({}, state, payload);
        }

        case INIT: {
            return payload.authentication || defaultState;
        }

        case CLEAN_CACHE: {
            return defaultState;
        }

        default:
            return state;
    }
}
