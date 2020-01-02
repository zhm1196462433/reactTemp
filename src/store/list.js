import produce from 'immer';
import { call, takeLatest, put } from 'redux-saga/effects';
import {
  createActionTypes,
  createAsyncAction,
  createAction,
  handleActions
} from '@/shared/redux-helpers';
import { queryList } from '@/services/api';

export const actionTypes = createActionTypes([
  'LIST_REQUEST',
  'LIST_SUCCESS',
  'LIST_FAILURE'
]);

export const actions = {
  fetch: createAsyncAction(actionTypes.LIST_REQUEST),
  save: createAction(actionTypes.LIST_SUCCESS),
  error: createAction(actionTypes.LIST_FAILURE)
};

export const reducer = handleActions({
  [actionTypes.LIST_REQUEST]: produce((draft) => {
    draft.loading = true;
  }),
  [actionTypes.LIST_SUCCESS]: produce((draft, { payload }) => {
    draft.list = payload.list;
    draft.total = payload.total;
    draft.loading = false;
  }),
  [actionTypes.LIST_FAILURE]: produce((draft, { payload }) => {
    draft.error = payload.msg;
    draft.loading = false;
  })
}, {
  loading: false,
  list: [],
  total: 0,
  error: ''
});

function* fetchList({ payload, __promise__ }) {
  const response = yield call(queryList, payload);
  yield put(actions.save(response));
  __promise__.resolve();
}

export function* actionsWatcher() {
  yield takeLatest(actionTypes.LIST_REQUEST, fetchList);
}
