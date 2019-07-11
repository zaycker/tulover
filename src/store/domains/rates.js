import { call, takeEvery, put, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { commonReducer } from './common';

export const FETCH_RATES = 'FETCH_RATES';
export const FETCH_RATES_PENDING = 'FETCH_RATES_PENDING';
export const FETCH_RATES_SUCCESS = 'FETCH_RATES_SUCCESS';
export const FETCH_RATES_ERROR = 'FETCH_RATES_ERROR';

export const START_FETCH_RATES_INTERVALED = 'START_FETCH_RATES_INTERVALED';
export const STOP_FETCH_RATES_INTERVALED = 'STOP_FETCH_RATES_INTERVALED';

export const fetchRates = () => ({ type: FETCH_RATES });
export const startFetchIntervaled = () => ({ type: START_FETCH_RATES_INTERVALED });
export const stopFetchIntervaled = () => ({ type: STOP_FETCH_RATES_INTERVALED });

const apiFetch = async (symbols) => {
    const url = `https://api.ratesapi.io/api/latest?base=EUR&symbols=${symbols.join(',')}`;
    const response = await fetch(url);

    if (response.status < 200 || response.status > 300) {
        throw Error(response.toString());
    }

    return response.json();
};

function* fetchRatesSaga() {
    yield put({
        type: FETCH_RATES_PENDING,
    });

    const cashHolder = yield select(({cashHolder}) => cashHolder);
    const symbols = Object.keys(cashHolder).filter(symbol => symbol !== 'EUR');
    try {
        const json = yield call(apiFetch, symbols);
        yield put({
            type: FETCH_RATES_SUCCESS,
            payload: {
                EUR: 1,
                ...json.rates
            },
        });
    } catch (error) {
        yield put({type: FETCH_RATES_ERROR, error});
    }
}

const ACTION_HANDLERS = {
    [FETCH_RATES_SUCCESS]: (_, action) => action.payload,
};

export const reducer = commonReducer(ACTION_HANDLERS);

function interval(action) {
    return eventChannel(emitter => {
        const iv = setInterval(() => emitter(action), 1e4);
        return () => { clearInterval(iv); }
    });
}

export function* sagas() {
    let fetchIntervaledChannel = null;

    yield takeEvery(FETCH_RATES, fetchRatesSaga);
    yield takeEvery(START_FETCH_RATES_INTERVALED, function* () {
        yield put(fetchRates());
        fetchIntervaledChannel = yield call(interval, fetchRates());
        yield takeEvery(fetchIntervaledChannel, function* (action) {
            yield put(action);
        });
    });
    yield takeEvery(STOP_FETCH_RATES_INTERVALED, function* () {
        if (fetchIntervaledChannel !== null) {
            yield call([fetchIntervaledChannel, fetchIntervaledChannel.close]);
        }
    });
}

export default {};
