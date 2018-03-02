// TODO: Better debugging.

import { Observable } from 'rxjs';
import { Component, Input } from '@angular/core';
import { Headers } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Config, InAppBrowser } from '../../../src/providers';
import { WpApiAuth, WpApiUsers } from 'wp-api-angular';
import { Store } from '@ngrx/store';
import { AppState } from "../../../src/reducers/index";
import { setAuthentication } from '../../actions';
import debug from 'debug';

const log = debug('LoginFormComponent');

export const TYPE_LOGIN = 'login';
export const TYPE_REGISTER = 'register';

interface ILoginFormMessage {
    type: string;
    message: string;
}

@Component({
    selector: 'login-form',
    templateUrl: 'login-form.html'
})
export class LoginFormComponent {

    @Input() onSuccess: (type, data) => void;
    @Input() onError: (type, data) => void;
    @Input() formType: string;

    private auth: FormGroup;
    registrationUrl: string;
    user: any;

    messages: ILoginFormMessage[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private iab: InAppBrowser,
        private config: Config,
        private wpApiAuth: WpApiAuth,
        private wpApiUsers: WpApiUsers,
        private store: Store<AppState>,
    ) {
        this.registrationUrl = this.config.get('registrationUrl');
        this.auth = this.formBuilder.group({
            'username': ['', Validators.required],
            'password': ['', Validators.required],
            'password2': ['', this.isPassword2Correct.bind(this)],
            'type': [TYPE_LOGIN]
        });
        this.setFormType(this.formType || TYPE_LOGIN);
    }

    isPassword2Correct() {
        if (!this.isRegisterForm) {
            return true;
        }
        return this.auth.value.password2 === this.auth.value.password;
    }

    setFormType(type) {
        this.formType = type;
        if (this.isRegisterForm && this.registrationUrl) {
            const browser = this.iab.create(this.registrationUrl);
            this.formType = TYPE_LOGIN;
        }
    }

    get isRegisterForm() { return this.formType === TYPE_REGISTER; }
    set isRegisterForm(val: boolean) {}

    get isLoginForm() { return this.formType === TYPE_LOGIN; }
    set isLoginForm(val: boolean) {}

    authFormOnSubmit() {
        this.messages = []; // Clear form messages on submit
        if (this.isRegisterForm) {
            this.register();
        }
        else {
            this.login();
        }
    }

    register() {
        log('register');
        this.wpApiUsers.create({
            user_login: this.auth.value.username,
            user_email: this.auth.value.username,
            user_pass: this.auth.value.password,
        }, {
            headers: new Headers({
                'Authorization': ''
            })
        })
            .map(response => response.json())
            .subscribe(json => {
                log(json);
                this.formType = TYPE_LOGIN;
                this.onSuccess && this.onSuccess(TYPE_REGISTER, json);
                this.login();
            }, errorResponse => {
                let error = errorResponse.json();
                log("error", error);
                this.messages.push({
                    type: 'error',
                    message: error.message
                });
                this.onError && this.onError(TYPE_REGISTER, error);
            });
    }

    login() {
        this.wpApiAuth.auth({
            username: this.auth.value.username,
            password: this.auth.value.password,
        })
            .map(response => response.json())
            .subscribe(json => {
                log('Got session', json);
                this.wpApiAuth.saveSession(json);
                this.store.dispatch(setAuthentication({
                    token: json.token,
                    name: json.user_display_name,
                    email: json.user_email
                }));
                this.onSuccess && this.onSuccess(TYPE_LOGIN, json);
            }, errorResponse => {
                let error = errorResponse.json();
                log("error", error);
                this.messages.push({
                    type: 'error',
                    message: error.message
                });
                this.onError && this.onError(TYPE_LOGIN, error);
            })
    }

}
