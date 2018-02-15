import { Component, OnInit } from '@angular/core';
import { StateService, UserActions } from 'app/store';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';


@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
})
export class LandingPageComponent {

    private user: firebase.User

    constructor(
        private state: StateService,
        private firebaseAuth: AngularFireAuth
    ) {}

    ngOnInit() {
        this.user = this.firebaseAuth.auth.currentUser;
    } 

}