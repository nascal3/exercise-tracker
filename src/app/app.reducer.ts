import {ActionReducerMap, createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromUi from './shared/ui.reducer';
import * as fromAuth from './auth/auth.reducer';

export interface State {
  ui: fromUi.State;
  auth: fromAuth.State;
}

export const reducers: ActionReducerMap<any> = {
  ui: fromUi.uiReducer,
  auth: fromAuth.getIsAuth
};

export const getUiState = createFeatureSelector<fromUi.State>('ui');
export const getIsLoaidng = createSelector(getUiState, fromUi.getIsLoading);

export const getAuthSate = createFeatureSelector<fromAuth.State>('auth');
export const getisAuth = createSelector(getAuthSate, fromAuth.getIsAuth);
