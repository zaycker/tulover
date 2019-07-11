import { compose, createStore, combineReducers, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { reducers, sagas } from './domains';

const rootReducer = combineReducers(reducers);
const sagaMiddleware = createSagaMiddleware();

let composeEnhancers = compose;

if (typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'function' && process.env.NODE_ENV !== 'production') {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
}

const initialState = {
    cashHolder: {
        USD: 223.56,
        EUR: 150.44,
        GBP: 86.45,
    },
    exchange: {
        currencySource: 'USD',
        currencyTarget: 'GBP',
    }
};

const store = createStore(
    rootReducer,
    window.__INITIAL_STATE__ || initialState,
    composeEnhancers(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(sagas);

export default store;
