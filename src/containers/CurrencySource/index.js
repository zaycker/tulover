import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import CurrencySign from 'components/CurrencySign';
import PrefixedInput from 'components/PrefixedInput';
import styles from './styles.module.css';

const useOnChangeHandler = (onChange) => {
    const [isValid, setValid] = useState(true);

    const onChangeHandler = useCallback(e => {
        const floatMatches = !e.target.value || /^\d+\.?\d{0,2}$/.test(e.target.value);

        if (floatMatches) {
            setValid(true);
            onChange(e.target.value);
        } else {
            setValid(false);
        }
    }, [onChange]);

    return [isValid, onChangeHandler];
};

const isExchangeAvailable = ({ amount, currencyTarget, currency, cashHolder }) => {
    if (currencyTarget === currency) {
        return false;
    }

    return cashHolder[currency] >= Number(amount);
};

const ExchangeRate = ({ currencyTarget, currency, rates }) => {
    const sourceToEur = rates[currency];
    const targetToEur = rates[currencyTarget];
    const rate = (Math.round(targetToEur / sourceToEur * 10e4) / 10e4).toFixed(4);

    return (
        <>
            <CurrencySign currency={currency} />
            {'1 = '}
            <CurrencySign currency={currencyTarget} />
            {rate.slice(0, rate.length - 2)}
            <span className={styles['currency-source__thousands']}>
                {rate.slice(rate.length - 2)}
            </span>
        </>
    );
};

const CurrencySource = ({
    active,
    exchange: {
        amount: value,
        currencyTarget
    },
    currency,
    rates,
    cashHolder,
    onExchange,
    onChange
}) => {
    const [isValid, onChangeHandler] = useOnChangeHandler(onChange);

    return (
        <div className={styles['currency-source']}>
            <div className={styles['currency-source__rate']}>
                <ExchangeRate
                    currencyTarget={currencyTarget}
                    currency={currency}
                    rates={rates}
                />
            </div>
            <div className={styles['currency-source__row']}>
            <span className={styles['currency-source__currency']}>
                {currency}
            </span>
                <PrefixedInput
                    onChange={onChangeHandler}
                    value={value}
                    prefix="-"
                    placeholder="123.45"
                    autoFocus={active}
                    pattern="^\d+\.?\d{0,2}$"
                />
            </div>
            <div className={styles['currency-source__row']}>
            <span className={styles['currency-source__avail']}>
                {'You have '}
                <CurrencySign currency={currency}/>
                {cashHolder[currency]}
            </span>
            </div>

            <button
                className={styles['currency-source__exchange']}
                disabled={!isValid || !isExchangeAvailable({ amount: value, currencyTarget, currency, cashHolder })}
                onClick={onExchange}
            >Exchange
            </button>
        </div>
    );
};

CurrencySource.propTypes = {
    currency: PropTypes.string.isRequired,
    cashHolder: PropTypes.object.isRequired,
    onExchange: PropTypes.func,
    onChange: PropTypes.func,
    exchange: PropTypes.object.isRequired,
    rates: PropTypes.object.isRequired,
};

CurrencySource.defaultProps = {
    onExchange: Function.prototype,
    onChange: Function.prototype,
};

export default connect(
    ({ rates, cashHolder, exchange }) => ({
        rates,
        cashHolder,
        exchange,
    })
)(CurrencySource);