import React, { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.css';

const useFullyControlledInput = (value, onChange, pattern) => {
    const [stateValue, setStateValue] = useState(value);

    useEffect(() => {
        if (stateValue !== value) {
            setStateValue(value);
        }
    }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

    const onChangeCallback = useCallback((e) => {
        const patternRegExp = new RegExp(`(${pattern})`);
        const match = e.target.value.match(patternRegExp);
        setStateValue(match ? match[0] : '');
        onChange && onChange(e);
    }, [onChange, pattern]);

    return [stateValue, onChangeCallback];
};

export default function PrefixedInput({ value, onChange, prefix, autoFocus, pattern, ...props }) {
    const [stateValue, onInputChange] = useFullyControlledInput(value, onChange, pattern);
    const inputRef = useRef(null);

    // autoFocus won't work here cause input rendered once and becomes visible with parent slide many times
    // that's why refs and focus() by hand
    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    return (
        <label className={styles['prefixed-input__label']}>
            {!!stateValue && (
                <span className={styles['prefixed-input__sign']}>{prefix}{stateValue}</span>
            )}
            <input
                type="text"
                className={styles['prefixed-input__input']}
                value={stateValue}
                onChange={onInputChange}
                ref={inputRef}
                {...props}
            />
        </label>
    );
}

PrefixedInput.propTypes = {
    onChange: PropTypes.func,
    prefix: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    pattern: PropTypes.string,
};

PrefixedInput.defaultProps = {
    onChange: Function.prototype,
    prefix: '',
    value: '',
    pattern: '.*',
};
