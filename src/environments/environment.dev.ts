import { FirebaseDevConfig } from '../app/config';
import { AppDevConfig } from '../app/config';
import { IEnvironmentConfig } from './environment.d';

export const environment: IEnvironmentConfig = {
    production: false,
    firebaseConfig: FirebaseDevConfig,
    appConfig: AppDevConfig
};
