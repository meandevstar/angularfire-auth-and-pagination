import { User, UserConfig } from '../../models';

export interface UserState {
    login: LogInState,
    signup: SignUpState,
    tempToken: string,
    phoneNumber: string,
    profile: UserConfig
};

export interface LogInState {
    isAccountChecked: boolean;
    checkConfigSent: boolean;
    isAccountExists: boolean;
    isEmailVerified: boolean;
    verifyEmailRequestSent: boolean,
    verifyEmailRequestSucess: boolean,
    verifyEmailRequestFailed: boolean,
    codeRequestSent: boolean;
    codeRequestSuccess: boolean;
    codeRequestFailed: boolean;
    verifyRequestSent: boolean;
    verifyRequestSuccess: boolean;
    verifyRequestFailed: boolean;
    signInWithRefreshTokenAttempt: boolean;
    signInWithRefreshTokenSuccess: boolean;
    signInWithRefreshTokenFailed: boolean;
}

export interface SignUpState {
    signUpTried: boolean;
    signUpRequestSent: boolean;
    signUpSuccess: boolean;
}

export const InitialLogInState: LogInState = {
    isAccountChecked: false,
    checkConfigSent: false,
    isAccountExists: false,
    isEmailVerified: false,
    verifyEmailRequestSent: false,
    verifyEmailRequestSucess: false,
    verifyEmailRequestFailed: false,
    codeRequestSent: false,
    codeRequestSuccess: false,
    codeRequestFailed: false,
    verifyRequestSent: false,
    verifyRequestSuccess: false,
    verifyRequestFailed: false,
    signInWithRefreshTokenAttempt: false,
    signInWithRefreshTokenSuccess: false,
    signInWithRefreshTokenFailed: false
}

export const InitialSignUpState: SignUpState = {
    signUpTried: false,    
    signUpRequestSent: false,
    signUpSuccess: false
}

export const InitialProfileState: UserConfig = {
    uid: '',
    firstName: '',
    lastName: '',
    email: '',
    type: 'USER',
    status: 'PENDING'
}

export const InitialUserState: UserState = { 
    login: InitialLogInState,
    signup: InitialSignUpState,
    tempToken: null,
    phoneNumber: null,
    profile: InitialProfileState
};