import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserActions } from './user.actions';
import { UserState, InitialUserState } from './user.states';
import { assign, assignDeep } from '../../helpers';

const reducer = (state = InitialUserState, action: UserActions.All): UserState => {
  switch(action.type) {
    case UserActions.SIGNUP_ATTEMPT:
      return assignDeep(state, {
        signup: {
          signUpTried: true,
          signUpRequestSent: true
        }
      });
    
    case UserActions.SIGNUP_SUCCESS: 
      return assignDeep(state, {
        signup: {
          signUpRequestSent: false,
          signUpSuccess: true
        }
      });
    
    case UserActions.SIGNUP_FAILURE: 
      return assignDeep(state, {
        signup: {
          signUpRequestSent: false,
          signUpSuccess: false
        }
      });
    
    case UserActions.CODE_REQUEST_ATTEMPT: 
      return assignDeep(state, {
        login: {
          codeRequestSent: true
        }
      });
    
    case UserActions.CODE_REQUEST_SUCCESS:
      return assignDeep(state, {
        login: {
          codeRequestSent: false,
          codeRequestSuccess: true,
          codeRequestFailed: false
        }
      });
    
    case UserActions.CODE_REQUEST_FAILURE: 
      return assignDeep(state, {
        login: {
          codeRequestSent: false,
          codeRequestSuccess: false,
          codeRequestFailed: true
        }
      });
    
    case UserActions.VERIFY_CODE_ATTEMPT: 
      return assignDeep(state, {
        login: {
          verifyRequestSent: true
        }
      });
    
    case UserActions.VERIFY_CODE_SUCCESS: 
      return assignDeep(state, {
        login: {
          verifyRequestSent: false,
          verifyRequestSuccess: true,
          verifyRequestFailed: false
        }
      });
    
    case UserActions.VERIFY_CODE_FAILURE: 
      return assignDeep(state, {
        login: {
          verifyRequestSent: false,
          verifyRequestSuccess: false,
          verifyRequestFailed: true
        }
      });
    
    case UserActions.SIGN_OUT: 
      return assign(state, InitialUserState);

    case UserActions.SEND_VERIFICATION_EMAIL: 
      return assignDeep(state, {
        login: {
          verifyEmailRequestSent: true
        }
      });

    case UserActions.CHECK_CONFIG_ATTEMPT: 
      return assignDeep(state, {
        login: {
          checkConfigSent: true
        }
      });
    
    case UserActions.CHECK_CONFIG_SUCCESS:
      return assignDeep(state, {
        login: {
          isAccountChecked: true,
          checkConfigSent: false,
          isAccountExists: action.payload.isAccountExists,
          isEmailVerified: action.payload.isEmailVerified
        },
        tempToken: action.payload.token,
        phoneNumber: action.payload.phoneNumber
      });
    
    case UserActions.CHECK_CONFIG_FAILURE: 
      return assignDeep(state, {
        login: {
          isAccountChecked: true,
          checkConfigSent: false
        }
      });

    case UserActions.RETRY_VERIFICATION: 
      return assignDeep(state, {
        login: {
          codeRequestSuccess: false,
          codeRequestFailed: false,
          verifyRequestSuccess: false,
          verifyRequestFailed: false
        }
      });
    
    case UserActions.FETCH_PROFILE_SUCCESS:
      return assignDeep(state, {
        profile: action.payload
      });
    
    
    default: 
      return state;
    
  }	
}

export const UserReducer = {
  reducer,
}