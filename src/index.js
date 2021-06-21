import React from 'react';
import ReactDOM from 'react-dom';
import 'react-hot-loader'
import 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {compose, createStore} from "redux";
import {Provider} from 'react-redux'
import {rootRedux} from "./redux/rootRedux";

const store = createStore(rootRedux, compose(
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
));

const app = (
    <Provider store={store}>
        {/*<React.StrictMode>*/}
        {/*    <App />*/}
        {/*</React.StrictMode>*/}

        <App />
    </Provider>
)

if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./App', App)
}

ReactDOM.render(
  app,
  document.getElementById('app')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
