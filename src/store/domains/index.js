import { all } from 'redux-saga/effects';
import {
    reducer as cashHolderReducer
} from './cashHolder';
import {
    reducer as exchangeReducer
} from './exchange';
import {
    reducer as ratesReducer,
    sagas as ratesSagas
} from './rates';

export const reducers = {
    cashHolder: cashHolderReducer,
    exchange: exchangeReducer,
    rates: ratesReducer
};

export const sagas = function* () {
    yield all([
        ratesSagas()
    ]);
};

export default {};
