
import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth'
import { Observable } from 'rxjs/Rx';
import { Effect } from '@ngrx/effects';
import * as _ from 'lodash';

import { ConfigActions } from './config.actions';
import { StateService } from '../state-service/state.service';
import { UserConfig } from 'app/models';


@Injectable()
export class ConfigEffects {

    @Effect()
    getConfig$ = this.state.actions$.ofType(ConfigActions.GET_USER_CONFIG_ATTEMPT)
        .switchMap((action: ConfigActions.GetUserConfigAttempt) => 
            this.afs.collection('users').snapshotChanges()
                .map(res => {
                    const uid = this.firebaseAuth.auth.currentUser.uid;
                    const currentUserType = this.state.getState().user.profile.type;

                    return res.map(data => {
                            return {
                                uid: data.payload.doc.id,
                                ...data.payload.doc.data()
                            }
                        })
                        .filter((data:any) => uid !== data.uid && 
                                        (currentUserType === 'SUPER_ADMIN' ||
                                        (currentUserType === 'ADMIN' && data.type === 'USER')))
                })
                .map((data:any) => new ConfigActions.GetUserConfigSuccess(data))
                .catch(error => Observable.of(new ConfigActions.GetUserConfigFailure())));
    
    @Effect()
    updateUser$ = this.state.actions$.ofType(ConfigActions.UPDATE_USER_ATTEMPT)
        .switchMap((action: ConfigActions.UpdateUserAttempt) => {
            const { uid } = action.payload;
            const userPayload = _.omit(action.payload, ['uid']);

            return this.afs.collection('users').doc(uid)
                           .set(userPayload)
                           .then(() => 
                                new ConfigActions.GetUserConfigAttempt())
                           .catch(() => 
                                new ConfigActions.GetUserConfigAttempt());
        });


    constructor(
        private state: StateService,
        private afs: AngularFirestore,
        private firebaseAuth: AngularFireAuth,
        private router: Router,
        private http: Http
    ) { }
}