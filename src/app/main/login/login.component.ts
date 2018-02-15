import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { async } from 'q';
import { StateService, UserEffects, UserActions } from '../../store';
import { validateEmail, validatePhoneCode,
         validatePhoneNumber, isEmptyObject } from '../../helpers';
import { UserConfig } from '../../models';
import * as firebase from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('txtCode')
  private txtCode: ElementRef;
  @ViewChild('txtPhoneNumber')
  private txtPhoneNumber: ElementRef;

  private securedPhoneNumber: string;
  private code: string;
  private email: string;
  private isEmailValid: boolean;
  private isCodeValid: boolean;
  private isPhoneValid: boolean;
  private isGrecaptchaResolved: boolean;
  private isApproved: boolean;
  private pendingTitle: string;
  private pendingMessage: string;

  private isAccountChecked$: Observable<boolean>;
  private isAccountExists$: Observable<boolean>;
  private isEmailVerified$: Observable<boolean>;
  private checkConfigSent$: Observable<boolean>;
  private codeRequestSent$: Observable<boolean>;
  private codeRequestSuccess$: Observable<boolean>;
  private codeRequestFailed$: Observable<boolean>;
  private verifyRequestSent$: Observable<boolean>;
  private verifyRequestSuccess$: Observable<boolean>;
  private verifyRequestFailed$: Observable<boolean>;
  private phoneNumber$: Observable<string>;
  private profile$: Observable<UserConfig>

  constructor(
    private state: StateService,
  ) { }

  ngOnInit() {
    this.isAccountChecked$ = this.state.select(s => s.user.login.isAccountChecked);
    this.isAccountExists$ = this.state.select(s => s.user.login.isAccountExists);
    this.isEmailVerified$ = this.state.select(s => s.user.login.isEmailVerified);
    this.checkConfigSent$ = this.state.select(s => s.user.login.checkConfigSent);
    this.codeRequestSent$ = this.state.select(s => s.user.login.codeRequestSent);
    this.codeRequestSuccess$ = this.state.select(s => s.user.login.codeRequestSuccess);
    this.codeRequestFailed$ = this.state.select(s => s.user.login.codeRequestFailed);
    this.verifyRequestSent$ = this.state.select(s => s.user.login.verifyRequestSent);
    this.verifyRequestSuccess$ = this.state.select(s => s.user.login.verifyRequestSuccess);
    this.verifyRequestFailed$ = this.state.select(s => s.user.login.verifyRequestFailed);
    this.phoneNumber$ = this.state.select(s => s.user.phoneNumber);
    this.profile$ = this.state.select(s => s.user.profile);

    this.checkConfigSent$.subscribe(result => {
      const loginInfo = this.state.getState().user.login;
      if (loginInfo.isAccountExists && loginInfo.isEmailVerified) {
        setTimeout(() => {
          this.txtPhoneNumber.nativeElement.focus();

          window['recaptchaVerifier'] = new firebase.auth.RecaptchaVerifier('recaptcha-container');
          window['recaptchaVerifier'].render().then(widgetId => {
            grecaptcha.reset(widgetId);
          });
        }, 50);
      }
    });

    this.phoneNumber$.subscribe(result => {
      if (isEmptyObject(result)) return;
      this.securedPhoneNumber = '\u2731'.repeat(result.length - 4) + result.slice(result.length - 4);
    });

    this.codeRequestSuccess$.subscribe(result => {
      if (result) {
        setTimeout(() => {
          this.txtCode.nativeElement.focus();          
        }, 50);
      }      
    });

    this.profile$.subscribe(data => {
      this.isApproved = data.email === '' || data.type === 'APPROVED';
    })

    // bind enter keys to buttons
    Observable.fromEvent(document, 'keypress').subscribe((e: any) => {
      if (e.which !== 13) return;
      const logInInfo = this.state.getState().user.login;

      if (!logInInfo.isAccountExists || !logInInfo.isEmailVerified) {
        this.checkAccount();
      } else {
        if (!logInInfo.codeRequestSuccess) {
          this.sendCodeRequest();
        } else {
          this.verifyCodeRequest();
        }
      }
    });

    this.isEmailValid = true;
    this.isPhoneValid = true;
    this.isCodeValid = true;
    this.isGrecaptchaResolved = true;
    this.securedPhoneNumber = null;
    this.isApproved = true;

    this.pendingTitle = 'You are not approved';
    this.pendingMessage = 'Please wait until admin approves you.';
  }

  sendCodeRequest() {
    if (!grecaptcha.getResponse().length) {
      this.isGrecaptchaResolved  = false;
    } else {      
      let phoneNumber = this.state.getState().user.phoneNumber;
      if (isEmptyObject(phoneNumber)) phoneNumber = this.securedPhoneNumber;
      this.isGrecaptchaResolved = true;      
      this.isPhoneValid = validatePhoneNumber(phoneNumber);

      if (this.isPhoneValid) {
        this.state.dispatch(new UserActions.CodeRequestAttempt(phoneNumber));
      }
    }
  }

  checkAccount() {
    this.isEmailValid = validateEmail(this.email);
    if (this.isEmailValid) {
      this.state.dispatch(new UserActions.CheckConfigAttempt(this.email)); 
    }
  }

  verifyCodeRequest() {
    this.isCodeValid = validatePhoneCode(this.code);
    if (this.isCodeValid) {
      this.state.dispatch(new UserActions.VerifyCodeAttempt(this.code));
    }
  }

  resendVerificationEmail() {
    this.isEmailValid = validateEmail(this.email);
    if (this.isEmailValid) {
      this.state.dispatch(new UserActions.SendVerificationEmail(this.email));
    }
  }

  retryVerificationCode() {
    this.code = '';
    this.state.dispatch(new UserActions.RetryVerification());
  }

  checkEmpty(val) {
    return isEmptyObject(val);
  }

}
