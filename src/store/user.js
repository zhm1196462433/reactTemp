import produce from 'immer';
import qs from 'querystring';
import { call, takeLatest, put } from 'redux-saga/effects';
import { push, replace } from 'connected-react-router';
import { keyBy } from 'lodash';
import {
  queryProfile, queryPermissions, accountLogin, accountLogout
} from '@/services/user';
import {
  createActionTypes, createAction, handleActions, createAsyncAction
} from '@/shared/redux-helpers';

export const actionTypes = createActionTypes([
  'LOGIN_REQUEST', 'LOGIN_SUCCESS', 'LOGIN_FAILURE', // 登录
  'LOGOUT_REQUEST', 'LOGOUT_SUCCESS', 'LOGOUT_FAILURE', // 退出
  'PROFILE_REQUEST', 'PROFILE_SUCCESS', 'PROFILE_FAILURE', // 获取用户信息
  'PERMISSIONS_REQUEST', 'PERMISSIONS_SUCCESS', 'PERMISSIONS_FAILURE' // 获取用户权限
], 'USER');

export const actions = {
  login: createAsyncAction(actionTypes.LOGIN_REQUEST),
  loggedIn: createAction(actionTypes.LOGIN_SUCCESS),
  logout: createAsyncAction(actionTypes.LOGOUT_REQUEST),
  loggedOut: createAction(actionTypes.LOGOUT_SUCCESS),
  fetchProfile: createAsyncAction(actionTypes.PROFILE_REQUEST),
  saveProfile: createAction(actionTypes.PROFILE_SUCCESS),
  fetchPermissions: createAsyncAction(actionTypes.PERMISSIONS_REQUEST),
  savePermissions: createAction(actionTypes.PERMISSIONS_SUCCESS)
};

export const reducer = handleActions({
  [actionTypes.LOGIN_SUCCESS]: produce((draft) => {
    draft.isLogin = true;
  }),
  [actionTypes.LOGOUT_SUCCESS]: produce((draft) => {
    draft.isLogin = false;
    draft.profile = {};
    draft.permissions = {};
  }),
  [actionTypes.PROFILE_SUCCESS]: produce((draft, { payload }) => {
    draft.profile = payload;
  }),
  [actionTypes.PERMISSIONS_SUCCESS]: produce((draft, { payload }) => {
    draft.permissions = payload;
  })
}, {
  isLogin: false,
  profile: {},
  permissions: {}
});

function* login({ payload, __promise__ }) {
  try {
    const response = yield call(accountLogin, payload);
    yield put(actions.loggedIn(response));

    const { redirect } = qs.parse(window.location.href.split('?')[0]);
    yield put(replace(redirect || '/'));
    __promise__.resolve();
  } catch {
    __promise__.reject();
  }
}

function* logout() {
  const response = yield call(accountLogout);
  yield put(actions.loggedOut(response));
  yield put(push('/login'));
}

function* fetchProfile() {
  const response = yield call(queryProfile);
  yield put(actions.saveProfile(response));
}

function* fetchPermissions({ __promise__ }) {
  const response = yield call(queryPermissions);
  const permissions = keyBy(response, 'key');
  yield put(actions.savePermissions(permissions));
  __promise__.resolve();
}

export function* actionsWatcher() {
  yield takeLatest(actionTypes.LOGIN_REQUEST, login);
  yield takeLatest(actionTypes.LOGOUT_REQUEST, logout);
  yield takeLatest(actionTypes.PROFILE_REQUEST, fetchProfile);
  yield takeLatest(actionTypes.PERMISSIONS_REQUEST, fetchPermissions);
}
