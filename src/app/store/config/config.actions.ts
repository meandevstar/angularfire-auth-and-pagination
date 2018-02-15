import { Action } from '@ngrx/store';
import { User, UserConfig } from '../../models';

export namespace ConfigActions {

    export const GET_USER_CONFIG_ATTEMPT = '[GetUserConfig] Attempt';
    export const GET_USER_CONFIG_SUCCESS = '[GetUserConfig] Success';
    export const GET_USER_CONFIG_FAILURE = '[GetUserConfig] Failure';
    export const UPDATE_USER_ATTEMPT = '[UpdateUser] Attempt';
    export const UPDATE_USER_SUCCESS = '[UpdateUser] Success';
    export const UPDATE_USER_FAILURE = '[UpdateUser] Failure';
  

    export class GetUserConfigAttempt implements Action {
        readonly type = GET_USER_CONFIG_ATTEMPT;
        constructor() {}
    }
    
    export class GetUserConfigSuccess implements Action {
        readonly type = GET_USER_CONFIG_SUCCESS;
        constructor(public payload: Array<UserConfig>) {}
    }

    export class GetUserConfigFailure implements Action {
        readonly type = GET_USER_CONFIG_FAILURE;
        constructor() {}
    }

    export class UpdateUserAttempt implements Action {
        readonly type = UPDATE_USER_ATTEMPT;
        constructor(public payload: any) {}
    }
    
    export class UpdateUserSuccess implements Action {
        readonly type = UPDATE_USER_SUCCESS;
        constructor() {}
    }
    
    export class UpdateUserFailure implements Action {
        readonly type = UPDATE_USER_FAILURE;
        constructor() {}
    }

    export type All = GetUserConfigAttempt | GetUserConfigSuccess | GetUserConfigFailure |
                      UpdateUserAttempt | UpdateUserSuccess | UpdateUserFailure ;

}