import { combineReducers } from 'redux';
import { fork } from 'redux-saga/effects';
import { connectRouter } from 'connected-react-router';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage
// import storageSession from 'redux-persist/lib/storage/session'; // sessionStorage

import { actionsWatcher as userActionsWatcher, reducer as userReducer } from './user';
import { reducer as menuReducer } from './menu';
import { actionsWatcher as listActionsWatcher, reducer as listReducer } from './list';

export const createRootReducer = history => combineReducers({
  router: connectRouter(history),
  user: persistReducer({
    key: '__auth__',
    storage,
    whitelist: ['isLogin', 'profile'],
  }, userReducer),
  menu: menuReducer,
  list: listReducer
});

export function* rootSaga() {
  yield fork(userActionsWatcher);
  yield fork(listActionsWatcher);
}
