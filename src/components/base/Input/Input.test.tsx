import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import '@testing-library/jest-dom';
import { Input } from '.';

describe('Input Component', () => {
  it('renders correctly with text type', () => {
    const { getByTestId } = render(<Input testID="input" type="text" />);
    const input = getByTestId('input');
    expect(input).toBeDefined();
    expect(input.props.placeholder).toBeUndefined();
    expect(input.props.keyboardType).toBeUndefined();
  });
  it('renders correctly with number type', () => {
    const { getByTestId } = render(<Input testID="input" type="number" />);
    const input = getByTestId('input');
    expect(input).toBeDefined();
    expect(input.props.placeholder).toBeUndefined();
    expect(input.props.keyboardType).toBe('number-pad');
  });
  it('calls onChangeValue prop when input text is changed', () => {
    const handleChangeValue = jest.fn();
    const { getByTestId } = render(
      <Input testID="input" type="text" onChangeValue={handleChangeValue} />
    );
    const input = getByTestId('input');
    fireEvent.changeText(input, 'new value');
    expect(handleChangeValue).toHaveBeenCalledTimes(1);
    expect(handleChangeValue).toHaveBeenCalledWith('new value');
  });
});
