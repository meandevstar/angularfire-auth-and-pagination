import { environment } from '../../../environments/environment';
import { AppState } from '../app.states';
import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

export type StateSelector<T> = (state: AppState) => T;

@Injectable()
export class StateService {

    constructor(
        private store: Store<AppState>,
        public actions$: Actions
    ) { }

    dispatch(...actions: Action[]) {
        actions.forEach(action => this.store.dispatch(action));
    }

    select<T>(selector: StateSelector<T>) {
        return this.store.select(selector);
    }

    getState(): AppState {
        let state: AppState;
        this.store.take(1).subscribe(s => state = s);
    
        return state;
    }
}
