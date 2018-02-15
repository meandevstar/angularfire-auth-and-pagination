import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { async } from 'q';
import { StateService, UserEffects, UserActions } from '../../store';
import { validateEmail } from '../../helpers';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignUpComponent implements OnInit {

  private firstName: string;
  private lastName: string;
  private email: string;
  private isNameValid: boolean;
  private isEmailValid: boolean;
  private isSignUpTried$: Observable<boolean>;
  private signUpRequestSent$: Observable<boolean>;
  private signUpSuccess$: Observable<boolean>;


  constructor(
    private state: StateService,
  ) { }

  ngOnInit() {
    this.signUpRequestSent$ = this.state.select(s => s.user.signup.signUpRequestSent);
    this.signUpSuccess$ = this.state.select(s => s.user.signup.signUpSuccess);
    this.isSignUpTried$ = this.state.select(s => s.user.signup.signUpTried);

    this.isEmailValid = true;
    this.isNameValid = true;
  }

  signUpAttempt() {
      this.isEmailValid = validateEmail(this.email);

      if (!this.firstName || !this.lastName) this.isNameValid = false;
      else this.isNameValid = true;

      if (this.isEmailValid && this.isNameValid) {
        this.state.dispatch(new UserActions.SignUpAttempt({
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email
        }));
      }
  }

}
