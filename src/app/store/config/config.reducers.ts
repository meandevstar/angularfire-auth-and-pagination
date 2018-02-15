import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ConfigActions } from './config.actions';
import { assign, assignDeep } from '../../helpers';
import { ConfigState, InitialConfigState } from './config.states';

const reducer = (state = InitialConfigState, action: ConfigActions.All): ConfigState => {
    switch(action.type) {
        case ConfigActions.GET_USER_CONFIG_ATTEMPT: 
            return assignDeep(state, {
                getConfigRequestSent: true
            });

        case ConfigActions.GET_USER_CONFIG_SUCCESS:
            let result = Object.assign(state, {
                getConfigRequestSent: false,
                getConfigRequestSuccess: true,
                getConfigRequestFailed: false,
            });
            state.data = action.payload;
            return result;

        case ConfigActions.GET_USER_CONFIG_FAILURE: 
            return assignDeep(state, {
                getConfigRequestSent: false,
                getConfigRequestSuccess: false,
                getConfigRequestFailed: true,
                data: []
            });

        case ConfigActions.UPDATE_USER_SUCCESS: 
            return assignDeep(state, {
                updateUserSuccess: true,
                updateUserFailed: false,
            });
        
        case ConfigActions.UPDATE_USER_FAILURE: 
            return assignDeep(state, {
                updateUserSuccess: false,
                updateUserFailed: true,
            });

        case ConfigActions.UPDATE_USER_SUCCESS: 
            return assignDeep(state, {
                updateUserSuccess: true,
                updateUserFailed: false,
            });

        default: 
            return state;
    }
}

export const ConfigReducer = {
    reducer,
  }