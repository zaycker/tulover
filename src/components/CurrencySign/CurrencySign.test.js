import React from 'react';
import renderer from 'react-test-renderer';
import CurrencySign from './index';

it('render correctly CurrencySign component', () => {
    const CurrencySignComponent = renderer.create(<CurrencySign currency="USD" />).toJSON();
    expect(CurrencySignComponent).toMatchSnapshot();
});