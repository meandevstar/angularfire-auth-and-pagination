
import { UserState, InitialUserState } from './user';
import { ConfigState, InitialConfigState } from './config';
import { TokenState, InitialTokenState } from './token';

export interface AppState {
    user: UserState;
    config: ConfigState;
    token: TokenState;
}

export const DefaultAppState: AppState = {
    user: InitialUserState,
    config: InitialConfigState,
    token: InitialTokenState
};
