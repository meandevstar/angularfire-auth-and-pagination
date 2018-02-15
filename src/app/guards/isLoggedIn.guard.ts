import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import { UserActions, StateService } from '../store';
import { UserConfig } from '../models'; 


@Injectable()
export class IsLoggedInGuard implements CanActivate, CanActivateChild {

    constructor(
        private firebaseAuth: AngularFireAuth,
        private state: StateService,
        private router: Router,
        private afs: AngularFirestore
    ) {}

    canActivate() {
        return this.redirectIfNotLoggedIn();
    }

    canActivateChild() {
        return this.redirectIfNotLoggedIn();
    }

    redirectIfNotLoggedIn(): Promise<boolean> {
        return this.isLoggedIn()
            .then(isAuth => {
                if (!isAuth) {
                    this.router.navigate(['/login']);
                }
                return isAuth;
            });
    }

    continueIfLoggedIn() {
        return this.firebaseAuth.authState.filter(a => !!a && !!a.uid);
    }

    isLoggedIn(): Promise<boolean> {
        return new Promise((resolve) => {
            this.firebaseAuth.authState.take(1).subscribe(a => {
                const uid = a ? a.uid : null;
    
                if (uid) {
                    return this.afs.collection('users').doc(uid).valueChanges().take(1)
                        .subscribe((res:any) => {
                            this.state.dispatch(new UserActions.FetchProfileSuccess(res as UserConfig));
                            resolve(res.status === 'APPROVED');
                        })
                } else {
                    resolve(false);
                }
                
            });
        }); 
    }
}
