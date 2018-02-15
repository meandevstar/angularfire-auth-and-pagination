import { Token } from '../../models';



export interface TokenState {
    data: Array<Token>;
    tokensInfo: any,
    getTokenRequestSent: boolean;
    getTokenRequestSuccess: boolean;
    getTokenRequestFailed: boolean;
    updateTokenSuccess: boolean;
    updateTokenFailed: boolean;
}

export const InitialTokenState: TokenState = {
    data: [],
    tokensInfo: { counts: 0 },
    getTokenRequestSent: false,
    getTokenRequestSuccess: false,
    getTokenRequestFailed: false,
    updateTokenSuccess: false,
    updateTokenFailed: false
}
