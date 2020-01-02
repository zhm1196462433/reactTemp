import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { ConnectedRouter, routerMiddleware } from 'connected-react-router';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { hot } from 'react-hot-loader/root';
import { setAutoFreeze } from 'immer';

import { createSagaPromiseMiddleware } from '@/shared/redux-helpers';
import { rootSaga, createRootReducer } from '@/store';
import App from './containers/App';
import routes from './routes';

/**
 * immer的auto freezing与redux-persist冲突
 * 在redux-persist v6未发布前，暂时禁用auto freezing解决冲突
 */
setAutoFreeze(false);

const history = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware();

/**
 * initial state tree
 * @type {Object}
 */
let initialState = {};

/* eslint-disable-next-line no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

/**
 * redux store
 * @type {Object}
 * @see http://redux.js.org/docs/api/createStore.html
 */
const store = createStore(
  createRootReducer(history),
  initialState,
  composeEnhancers(
    applyMiddleware(
      routerMiddleware(history),
      createSagaPromiseMiddleware(),
      sagaMiddleware
    )
  )
);

const persistor = persistStore(store);

/**
 * 暴露全局store提供给axios使用
 */
/* eslint-disable-next-line no-underscore-dangle */
window.__g_store__ = store;

sagaMiddleware.run(rootSaga);

const WrappedApp = () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <ConnectedRouter history={history}>
        <App routes={routes} />
      </ConnectedRouter>
    </PersistGate>
  </Provider>
);

ReactDOM.render(
  <WrappedApp />,
  document.getElementById('app')
);

export default hot(WrappedApp);
