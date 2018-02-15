import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Rx';
import { Effect } from '@ngrx/effects';

import { UserActions } from './user.actions';
import { StateService } from '../state-service/state.service';
import { environment } from '../../../environments/environment';
import { isEmptyObject } from '../../helpers';
import { UserConfig } from 'app/models';
import * as firebase from 'firebase';

@Injectable()
export class UserEffects {

    @Effect()
    codeRequest$ = this.state.actions$.ofType(UserActions.CODE_REQUEST_ATTEMPT)
        .switchMap((action: UserActions.CodeRequestAttempt) => { 
            return this.firebaseAuth.auth.signInWithPhoneNumber(action.payload, window['recaptchaVerifier'])
                .then(confirmationResult => {
                    window['confirmationResult'] = confirmationResult;
                    return new UserActions.CodeRequestSuccess();
                })
                .catch(error => {
                    return new UserActions.CodeRequestFailure();
                })});

    @Effect()
    verifyRequest$ = this.state.actions$.ofType(UserActions.VERIFY_CODE_ATTEMPT)
        .switchMap((action: UserActions.VerifyCodeAttempt) => {
            const token = localStorage.getItem('temp-token');
            let promise = Promise.resolve();
            
            if (!isEmptyObject(token)) {
                promise = this.firebaseAuth.auth.signInWithCustomToken(token);
            }

            return Observable.from(
                promise.then(() => {
                    let prevUser = this.firebaseAuth.auth.currentUser || null;
                    let inPromise = null;

                    if (prevUser) {
                       const credential = 
                               firebase.auth.PhoneAuthProvider.credential(window['confirmationResult'].verificationId, action.payload);
                        inPromise = prevUser.updatePhoneNumber(credential);
                    } else {
                        inPromise = window['confirmationResult'].confirm(action.payload)
                    }
                   
                    return inPromise.then(result => {
                        localStorage.removeItem('temp-token');
                        setTimeout(this.router.navigate(['/dashboard']), 50);
                        return new UserActions.VerifyCodeSuccess();
                    })
                    .catch(error => {
                        console.log(error);
                        if (this.firebaseAuth.auth.currentUser) this.firebaseAuth.auth.signOut();
                        return new UserActions.VerifyCodeFailure();
                    })
                }))
        });

    @Effect()
    signOut$ = this.state.actions$.ofType(UserActions.SIGN_OUT)
        .switchMap((action: UserActions.SignOut) => {
            this.router.navigate(['/login']);            
            this.firebaseAuth.auth.signOut();
            return Observable.empty();
        });

    @Effect()
    checkConfig$ = this.state.actions$.ofType(UserActions.CHECK_CONFIG_ATTEMPT)
        .switchMap((action: UserActions.CheckConfigAttempt) => {
            let params: URLSearchParams = new URLSearchParams();
            params.set('email', action.payload);

            return Observable.from(
                this.http.get(environment.appConfig.baseUrl + 'checkAccount', {search: params})
                    .map(res => new UserActions.CheckConfigSuccess(res.json())));
        });

    @Effect()
    sendVerificationEmail$ = this.state.actions$.ofType(UserActions.SEND_VERIFICATION_EMAIL)
        .switchMap((action: UserActions.SendVerificationEmail) => {
            const token = localStorage.getItem('temp-token');
            
            if (token) {
                this.firebaseAuth.auth.signInWithCustomToken(token)
                    .then(() => this.firebaseAuth.auth.currentUser.sendEmailVerification()
                                    .then(() => this.firebaseAuth.auth.signOut()));
            }

            return Observable.empty();
        });
    
    @Effect()
    createAccount$ = this.state.actions$.ofType(UserActions.SIGNUP_ATTEMPT)
        .switchMap((action: UserActions.SignUpAttempt) => {
            let params: URLSearchParams = new URLSearchParams();
            params.set('email', action.payload.email);
            params.set('firstName', action.payload.firstName);
            params.set('lastName', action.payload.lastName);

            return Observable.from(
                this.http.get(environment.appConfig.baseUrl + 'createAccount', {search: params})
                    .map(res => {
                        const token = res.json().token;
                        localStorage.setItem('temp-token', token);
                        this.firebaseAuth.auth.signInWithCustomToken(token)
                            .then(() => this.firebaseAuth.auth.currentUser.sendEmailVerification()
                                            .then(() => this.firebaseAuth.auth.signOut())
                                            .catch(error => this.firebaseAuth.auth.signOut()));
                        return new UserActions.SignUpSuccess(res.json().token);
                    }));
        });



    constructor(
        private state: StateService,
        private firebaseAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private router: Router,
        private http: Http
    ) { }
}
