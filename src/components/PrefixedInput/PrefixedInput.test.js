import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import PrefixedInput from './index';

it('render correctly PrefixedInput component', () => {
    const PrefixedInputComponent = renderer.create(
        <PrefixedInput />
    ).toJSON();
    expect(PrefixedInputComponent).toMatchSnapshot();
});

it('correctly validates values by pattern on change', () => {
    const wrapper = mount(
        <PrefixedInput pattern="^\d+\.?\d{0,2}$" />
    );

    wrapper.find('.prefixed-input__input').simulate('change', { target: { value: '123.45' }});
    expect(wrapper.find('.prefixed-input__input').props().value).toBe('123.45');

    wrapper.find('.prefixed-input__input').simulate('change', { target: { value: '12abc' }});
    expect(wrapper.find('.prefixed-input__input').props().value).toBe('');
});