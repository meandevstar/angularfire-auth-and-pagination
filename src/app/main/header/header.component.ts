import { Component, OnInit } from '@angular/core';
import { StateService, UserActions } from 'app/store';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserConfig } from '../../models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  private user: UserConfig
  
  constructor(
    private state: StateService,
    private firebaseAuth: AngularFireAuth
  ) { }

  ngOnInit() {
    this.state.select(s => s.user.profile)
      .subscribe(profile => this.user = profile);
  }

  isAdmin() {
    return this.user && (this.user.type === 'SUPER_ADMIN' || this.user.type === 'ADMIN');
  }

  signOut() {
    this.state.dispatch(new UserActions.SignOut());
  }

}
