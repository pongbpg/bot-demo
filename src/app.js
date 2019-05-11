import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';

import { login, startGetAuth, logout } from './actions/auth';
import { startListOrders } from './actions/orders';
import {startGetLive} from './actions/widget/live';
import { startListPages } from './actions/pages';
import AppRouter, { history } from './routers/AppRouter';
import configureStore from './store/configureStore';

import 'bulma/css/bulma.css'
import 'react-datepicker/dist/react-datepicker.css';
import { auth } from './firebase/firebase';
import LoadingPage from './components/LoadingPage';

const store = configureStore();

const jsx = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

let hasRendered = false;
const renderApp = () => {
  if (!hasRendered) {
    ReactDOM.render(jsx, document.getElementById('app'));
    hasRendered = true;
  }
};

ReactDOM.render(<LoadingPage />, document.getElementById('app'));

const logOut = () => {
  store.dispatch(logout());
  renderApp();
  history.push('/');
}

auth.onAuthStateChanged((user) => {
  // console.log(user)
  if (user) {
    store.dispatch(startGetAuth(user)).then((auth) => {
      // store.dispatch(startListOrders())
      store.dispatch(startGetLive())
      store.dispatch(startListPages(store.getState().auth))
        .then(() => {
          renderApp()
        })
    })
  } else {
    logOut();
  }
});


    // store.dispatch(startListApps(store.getState().user.apps));
    // if (history.location.pathname === '/' && store.getState().sys.path === '/') {
    //   history.push('/dashboard');
    // } else {
    //   const path = store.getState().sys.path;
    //   if (typeof path === 'string') {
    //     if (path.indexOf('callback') > -1) {
    //       const search = path.split("?")[1].split("&");
    //       let config = {};
    //       for (var i = 0; i < search.length; i++) {
    //         const query = search[i].split('=');
    //         config[query[0]] = query[1];
    //       }
    //       store.dispatch(startGetAppById(config.appId))
    //         .then((app) => {
    //           const token = jwt.sign({
    //             appId: config.appId,
    //             appName: app.appName,
    //             username: store.getState().auth.idcard,
    //             description: store.getState().user.displayName
    //           },
    //             app.secretKey,
    //             { expiresIn: app.tokenExpired });
    //           const callback = `${app.callbackProtocol}://${app.callbackUrl}?token=${token}`;
    //           window.location = callback;
    //         })

    //     }
    //   }
    //   history.push(store.getState().sys.path);
    // }
    // }
    // renderApp();
