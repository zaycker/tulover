import React, { useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import {startFetchIntervaled, stopFetchIntervaled} from 'store/domains/rates';
import {
  setExchangeAmount,
  setSourceCurrency,
  setTargetCurrency,
} from 'store/domains/exchange';
import { exchangeCurrencies } from 'store/domains/cashHolder';
import CurrencySource from 'containers/CurrencySource';
import CurrencyTarget from 'containers/CurrencyTarget';
import SlideSelect from 'components/SlideSelect';
import styles from './styles.module.css';

const mapDispatchToProps = {
    startFetchIntervaled,
    stopFetchIntervaled,
    setExchangeAmount,
    setSourceCurrency,
    setTargetCurrency,
    exchangeCurrencies,
};

const mapStateToProps = ({ rates, cashHolder, exchange }) => ({
  rates,
  cashHolder,
  exchange,
});

const useOnCurrencySelect = (currency, currencies, setCurrency) =>
    useCallback(selected => {
        const newCurrency = currencies[selected];
        if (currency !== newCurrency) {
            setCurrency(newCurrency);
        }
    }, [currency, currencies, setCurrency]);

const useOnExchange = (currencySource, currencyTarget, amount, rates, exchangeCurrencies) =>
    useCallback(() => {
        const sourceToEur = rates[currencySource];
        const targetToEur = rates[currencyTarget];
        const rate = targetToEur / sourceToEur;
        exchangeCurrencies({ currencySource, currencyTarget, amount, rate });
    }, [currencySource, currencyTarget, amount, rates, exchangeCurrencies]);

const Exchange = ({
    rates,
    cashHolder,
    exchange: {
        amount,
        currencySource,
        currencyTarget
    },

    exchangeCurrencies,
    setExchangeAmount,
    startFetchIntervaled,
    stopFetchIntervaled,
    setSourceCurrency,
    setTargetCurrency,
}) => {
    useEffect(() => {
        startFetchIntervaled();

        return stopFetchIntervaled;
    }, [startFetchIntervaled, stopFetchIntervaled]);

    const currencies = useMemo(() => Object.keys(cashHolder), [cashHolder]);
    const onSourceCurrencySelect = useOnCurrencySelect(currencySource, currencies, setSourceCurrency);
    const onTargetCurrencySelect = useOnCurrencySelect(currencyTarget, currencies, setTargetCurrency);
    const onExchange = useOnExchange(currencySource, currencyTarget, amount, rates, exchangeCurrencies);

    const currencySourceIndex = currencies.indexOf(currencySource);
    const currencyTargetIndex = currencies.indexOf(currencyTarget);

    return (
        <div className={styles.exchange}>
            <div className={styles['from-currency']}>
                <SlideSelect
                    selected={currencySourceIndex > -1 ? currencySourceIndex : 0}
                    onSelect={onSourceCurrencySelect}
                >
                    {currencies.map(currency => (
                        <CurrencySource
                            key={currency}
                            currency={currency}
                            onChange={setExchangeAmount}
                            onExchange={onExchange}
                        />
                    ))}
                </SlideSelect>
            </div>
            <div className={styles['to-currency']}>
                <SlideSelect
                    selected={currencyTargetIndex > -1 ? currencyTargetIndex : 0}
                    onSelect={onTargetCurrencySelect}
                >
                    {currencies.map(currency => (
                        <CurrencyTarget
                            key={currency}
                            currency={currency}
                        />
                    ))}
                </SlideSelect>
            </div>
        </div>
    );
};

Exchange.propTypes = {
  startFetchIntervaled: PropTypes.func.isRequired,
  setExchangeAmount: PropTypes.func.isRequired,
  setSourceCurrency: PropTypes.func.isRequired,
  setTargetCurrency: PropTypes.func.isRequired,
  exchangeCurrencies: PropTypes.func.isRequired,

  rates: PropTypes.object.isRequired,
  cashHolder: PropTypes.object.isRequired,
  exchange: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Exchange);