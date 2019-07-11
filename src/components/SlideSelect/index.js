import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Dots from 'components/Dots';
import styles from './styles.module.css';

const useOnPrev = ({ onSelect, selected }) =>
    useCallback(() =>
        onSelect(Math.max(selected - 1, 0)),
        [onSelect, selected]
    );

const useOnNext = ({ children, onSelect, selected }) =>
    useCallback(() =>
            onSelect(Math.min(selected + 1, children.length - 1)),
        [children.length, onSelect, selected]
    );

const SlideSelect = ({ children, onSelect, selected }) => {
    const onPrev = useOnPrev({ onSelect, selected });
    const onNext = useOnNext({ children, onSelect, selected });

    // Compensation of css transitions
    // don't want to use React.transitions
    // set 'activity' of slide delayed after it has been animated to view
    const [activeIndex, setActiveIndex] = useState(selected);

    useEffect(() => {
        setTimeout(() => { setActiveIndex(selected); }, 300);
    }, [selected]);

    return (
        <div className={styles['slide-select']}>
            <div
                className={styles['slide-select__slides']}
                style={{ left: `${-100 * selected}%` }}
            >
                {React.Children.map(children, (child, index) =>
                    React.cloneElement(child, { active: index === activeIndex })
                )}
            </div>
            <Dots
                className={styles['slide-select__dots']}
                elements={children}
                selected={selected}
            />
            <button
                onClick={onPrev}
                className={styles['slide-select__left']}
                disabled={selected !== activeIndex}
            />
            <button
                onClick={onNext}
                className={styles['slide-select__right']}
                disabled={selected !== activeIndex}
            />
        </div>
    );
};

SlideSelect.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
    selected: PropTypes.number,
    onSelect: PropTypes.func,
};

SlideSelect.defaultProps = {
    selected: 0,
    onSelect: Function.prototype,
};

export default SlideSelect;
