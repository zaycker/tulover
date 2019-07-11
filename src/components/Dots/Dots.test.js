import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import Dots from './index';

it('render correctly Dots component', () => {
    const DotsComponent = renderer.create(
        <Dots elements={[1,2,3]} selected={1} className="example" />
    ).toJSON();
    expect(DotsComponent).toMatchSnapshot();
});

it('should use props [elements, selected, className]', () => {
    const wrapper = shallow(
        <Dots elements={[1,2,3]} selected={1} className="example" />
    );
    expect(wrapper.find('.example')).toHaveLength(1);
    expect(wrapper.find('.dots__dot')).toHaveLength(3);
    expect(wrapper.find('.dots__dot').at(1).is('.dots__dot_active')).toBe(true);
});