import { FirebaseProdConfig } from '../app/config';
import { AppProdConfig } from '../app/config';
import { IEnvironmentConfig } from './environment.d';

export const environment: IEnvironmentConfig = {
    production: true,
    firebaseConfig: FirebaseProdConfig,
    appConfig: AppProdConfig
};
