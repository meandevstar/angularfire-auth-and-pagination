import { UserConfig } from '../../models';



export interface ConfigState {
    data: Array<UserConfig>;
    getConfigRequestSent: boolean;
    getConfigRequestSuccess: boolean;
    getConfigRequestFailed: boolean;
    updateUserSuccess: boolean;
    updateUserFailed: boolean;
}

export const InitialConfigState: ConfigState = {
    data: [],
    getConfigRequestSent: false,
    getConfigRequestSuccess: false,
    getConfigRequestFailed: false,
    updateUserSuccess: false,
    updateUserFailed: false
}
