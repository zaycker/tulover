import React from 'react';
import PropTypes from 'prop-types';
import CurrencySign from 'components/CurrencySign';
import PrefixedInput from 'components/PrefixedInput';
import styles from './styles.module.css';
import {connect} from "react-redux";

const getExchangeValue = ({value: amount, currencySource, currency, rates}) => {
    const sourceToEur = rates[currencySource];
    const targetToEur = rates[currency];
    const value = amount * targetToEur / sourceToEur;
    return value ? Math.round(value * 100) / 100 : '';
};

const ExchangeRate = ({currencySource, currency, rates}) => {
    const sourceToEur = rates[currencySource];
    const targetToEur = rates[currency];

    if (currency === currencySource) {
        return '';
    }

    return (
        <>
            <CurrencySign currency={currency}/>
            {'1 = '}
            <CurrencySign currency={currencySource}/>
            {Math.round((sourceToEur / targetToEur) * 100) / 100}
        </>
    );
};

const CurrencyTarget = ({
    exchange: {
        amount: value,
        currencySource,
        currencyTarget
    },
    currency,
    rates,
    cashHolder
}) => (
    <div className={styles['currency-target']}>
        <div className={styles['currency-target__row']}>
            <span className={styles['currency-target__currency']}>
                {currency}
            </span>
            <PrefixedInput
                value={getExchangeValue({value, currencySource, currency, rates})}
                prefix="+"
                readOnly
            />
        </div>
        <div className={styles['currency-target__row']}>
            <span className={styles['currency-target__avail']}>
                {'You have '}
                <CurrencySign currency={currencyTarget}/>
                {' '}
                {cashHolder[currencyTarget]}
            </span>
            <span className={styles['currency-target__rate']}>
                <ExchangeRate
                    currencySource={currencySource}
                    currency={currency}
                    rates={rates}
                />
            </span>
        </div>
    </div>
);

CurrencyTarget.propTypes = {
    currency: PropTypes.string.isRequired,
    cashHolder: PropTypes.object.isRequired,
    exchange: PropTypes.object.isRequired,
    rates: PropTypes.object.isRequired,
};

export default connect(
    ({rates, cashHolder, exchange}) => ({
        rates,
        cashHolder,
        exchange,
    })
)(CurrencyTarget);
