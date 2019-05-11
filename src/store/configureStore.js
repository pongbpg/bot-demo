import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import authReducer from '../reducers/auth';
import ordersReducer from '../reducers/orders';
import cutoffsReducer from '../reducers/cutoffs';
import searchReducer from '../reducers/search';
import stockReducer from '../reducers/stock';
import pagesReducer from '../reducers/pages';
import sayhisReducer from '../reducers/sayhis';
import costsReducer from '../reducers/costs';
import liveReducer from '../reducers/live';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
  const store = createStore(
    combineReducers({
      auth: authReducer,
      orders: ordersReducer,
      cutoffs: cutoffsReducer,
      search: searchReducer,
      stock: stockReducer,
      pages: pagesReducer,
      sayhis: sayhisReducer,
      costs: costsReducer,
      live: liveReducer,

    }),
    composeEnhancers(applyMiddleware(thunk))
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  return store;
};
