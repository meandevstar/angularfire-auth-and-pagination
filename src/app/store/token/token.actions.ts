import { Action } from '@ngrx/store';
import { Token } from '../../models';

export namespace TokenActions {

    export const GET_TOKEN_ATTEMPT = '[GetToken] Attempt';
    export const GET_TOKEN_SUCCESS = '[GetToken] Success';
    export const GET_TOKEN_FAILURE = '[GetToken] Failure';
  

    export class GetTokenAttempt implements Action {
        readonly type = GET_TOKEN_ATTEMPT;
        constructor(public payload: any) {}
    }

    export class GetTokenSuccess implements Action {
        readonly type = GET_TOKEN_SUCCESS;
        constructor(public payload: any) {}
    }

    export class GetTokenFailure implements Action {
        readonly type = GET_TOKEN_FAILURE;
        constructor() {}
    }

    export type All = GetTokenAttempt | GetTokenSuccess | GetTokenFailure ;
}