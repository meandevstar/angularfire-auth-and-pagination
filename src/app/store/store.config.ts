
import { ActionReducerMap, ActionReducer, MetaReducer } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { localStorageSync } from 'ngrx-store-localstorage';
import { AppState } from './app.states';
import { UserReducer } from './user';
import { ConfigReducer } from './config';
import { TokenReducer } from './token';
import { environment } from '../../environments/environment';

export const reducers: ActionReducerMap<AppState> = {
  user: UserReducer.reducer,
  config: ConfigReducer.reducer,
  token: TokenReducer.reducer,
};

export function logger(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return function(state: AppState, action: any): AppState {
    console.log('state', state);
    console.log('action', action);
    return reducer(state, action);
  };
}

export function localStorageSyncReducer(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return localStorageSync({
    keys: [
      {user: ['profile']}
    ]
  })(reducer);
}

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? [logger, localStorageSyncReducer]
  : [localStorageSyncReducer];