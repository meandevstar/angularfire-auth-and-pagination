import { Action } from '@ngrx/store';
import { User, UserConfig } from '../../models';

export namespace UserActions {

  export const CHECK_CONFIG_ATTEMPT = '[CheckConfig] Attempt';
  export const CHECK_CONFIG_SUCCESS = '[CheckConfig] Success';
  export const CHECK_CONFIG_FAILURE = '[CheckConfig] Failure';
  export const SEND_VERIFICATION_EMAIL = '[SendVerificationEmail]';
  export const CODE_REQUEST_ATTEMPT = '[CodeRequest] Attempt';
  export const CODE_REQUEST_SUCCESS = '[CodeRequest] Success';
  export const CODE_REQUEST_FAILURE = '[CodeRequest] Failure';
  export const RETRY_VERIFICATION = '[CodeRequest] Retry Verification';
  export const VERIFY_CODE_ATTEMPT = '[VerifyCode] Attempt';
  export const VERIFY_CODE_SUCCESS = '[VerifyCode] Success';
  export const VERIFY_CODE_FAILURE = '[VerifyCode] Failure';
  export const FETCH_PROFILE_ATTEMPT = '[FetchProfile] Attempt';
  export const FETCH_PROFILE_SUCCESS = '[FetchProfile] Success';
  export const FETCH_PROFILE_FAILED = '[FetchProfile] Failed';
  export const SIGNUP_ATTEMPT = '[SignUp] Attempt';
  export const SIGNUP_SUCCESS = '[SignUp] Success';
  export const SIGNUP_FAILURE = '[SignUp] Failure';
  export const SIGN_OUT = '[Signout]';

  export class CheckConfigAttempt implements Action {
    readonly type = CHECK_CONFIG_ATTEMPT;
    constructor(public payload: string) {}
  }
  
  export class CheckConfigSuccess implements Action {
    readonly type = CHECK_CONFIG_SUCCESS;
    constructor(public payload: any) {}
  }
  
  export class CheckConfigFailure implements Action {
    readonly type = CHECK_CONFIG_FAILURE;
    constructor() {}
  }

  export class SendVerificationEmail implements Action {
    readonly type = SEND_VERIFICATION_EMAIL;
    constructor(public payload: string) {}
  }
  
  export class CodeRequestAttempt implements Action {
    readonly type = CODE_REQUEST_ATTEMPT;
    constructor(public payload: string) {}
  }
  
  export class CodeRequestSuccess implements Action {
    readonly type = CODE_REQUEST_SUCCESS;
    constructor() {}
  }
  
  export class CodeRequestFailure implements Action {
    readonly type = CODE_REQUEST_FAILURE;
    constructor() {}
  }

  export class RetryVerification implements Action {
    readonly type = RETRY_VERIFICATION;
    constructor() {}
  }

  export class VerifyCodeAttempt implements Action {
    readonly type = VERIFY_CODE_ATTEMPT;
      constructor(public payload: string) {}
  }
  
  export class VerifyCodeSuccess implements Action {
    readonly type = VERIFY_CODE_SUCCESS;
    constructor() {}
  }
  
  export class VerifyCodeFailure implements Action {
    readonly type = VERIFY_CODE_FAILURE;
    constructor() {}
  }

  export class FetchProfileAttempt implements Action {
    readonly type = FETCH_PROFILE_ATTEMPT;
    constructor(public payload) {}
  }

  export class FetchProfileSuccess implements Action {
    readonly type = FETCH_PROFILE_SUCCESS;
    constructor(public payload: UserConfig) {}
  }
  
  export class FetchProfileFailure implements Action {
    readonly type = FETCH_PROFILE_FAILED;
    constructor() {}
  }
  
  // payload: { email, name }
  export class SignUpAttempt implements Action {
    readonly type = SIGNUP_ATTEMPT;
    constructor(public payload: any) {}
  }
  
  export class SignUpSuccess implements Action {
    readonly type = SIGNUP_SUCCESS;
    constructor(public payload: string) {}
  }
  
  export class SignUpFailure implements Action {
    readonly type = SIGNUP_FAILURE;
    constructor(public payload: string) {}
  }

  export class SignOut implements Action {
    readonly type = SIGN_OUT;
    constructor() {}
  }
  
  
  
  export type All = CheckConfigAttempt | CheckConfigSuccess | CheckConfigFailure |
                    SendVerificationEmail |
                    VerifyCodeAttempt | VerifyCodeSuccess | VerifyCodeFailure |
                    CodeRequestAttempt | CodeRequestSuccess | CodeRequestFailure |
                    RetryVerification |
                    FetchProfileAttempt | FetchProfileSuccess | FetchProfileFailure |
                    SignUpAttempt | SignUpSuccess | SignUpFailure |
                    SignOut;

}