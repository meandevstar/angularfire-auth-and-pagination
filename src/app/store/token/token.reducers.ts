import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TokenActions } from './token.actions';
import { assign, assignDeep } from '../../helpers';
import { TokenState, InitialTokenState } from './token.states';

const reducer = (state = InitialTokenState, action: TokenActions.All): TokenState => {
    switch(action.type) {
        case TokenActions.GET_TOKEN_ATTEMPT: 
            return assignDeep(state, {
                getTokenRequestSent: true
            });

        case TokenActions.GET_TOKEN_SUCCESS:
            let result = Object.assign(state, {
                getTokenRequestSent: false,
                getTokenRequestSuccess: true,
                getTokenRequestFailed: false
            });
            if (action.payload.tokensInfo) state.tokensInfo = action.payload.tokensInfo;
            state.data = action.payload.data;
            return result;

        case TokenActions.GET_TOKEN_FAILURE:
            return assignDeep(state, {
                getTokenRequestSent: false,
                getTokenRequestSuccess: false,
                getTokenRequestFailed: true
            });
        
        default: 
            return state;
    }
}

export const TokenReducer = {
    reducer,
}