import { Action } from '@ngrx/store'

export const AUTHENTICATE = 'AUTHENTICATE';

export const setAuthentication = (details): Action => ({
    type: AUTHENTICATE,
    payload: details
})
