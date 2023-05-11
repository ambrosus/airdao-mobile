import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { CheckBox } from '.';
import { BaseCheckBoxProps } from './CheckBox.types';

describe('CheckBox Component', () => {
  const testID = 'checkbox';
  const testProps: BaseCheckBoxProps = {
    testID,
    value: true,
    fillColor: 'red',
    onValueChange: jest.fn()
  };
  it('should render square checkbox when specified', () => {
    const { getByTestId } = render(<CheckBox type="square" {...testProps} />);
    const squareCheckboxChild = getByTestId(testID + '-square');
    expect(squareCheckboxChild).toBeDefined();
  });
  it('should render circular checkbox when specified', () => {
    const { getByTestId } = render(<CheckBox type="circular" {...testProps} />);
    const circularCheckboxChild = getByTestId(testID + '-circular');
    expect(circularCheckboxChild).toBeDefined();
  });
  it('should call onValueChange when pressed', () => {
    const testID = 'checkbox';
    const testProps: BaseCheckBoxProps = {
      testID,
      value: true,
      fillColor: 'red',
      onValueChange: jest.fn()
    };
    const { getByTestId } = render(<CheckBox type="square" {...testProps} />);
    const squareCheckbox = getByTestId(testID);
    fireEvent.press(squareCheckbox);
    expect(testProps.onValueChange).toHaveBeenCalledWith(false);
  });
  it('should not call onValueChange when the checkbox is disabled', () => {
    const testID = 'checkbox';
    const testProps: BaseCheckBoxProps = {
      testID,
      value: true,
      fillColor: 'red',
      onValueChange: jest.fn()
    };
    const { getByTestId } = render(
      <CheckBox
        type="square"
        {...testProps}
        testID={testID}
        onValueChange={undefined}
      />
    );
    const squareCheckbox = getByTestId(testID);
    fireEvent.press(squareCheckbox);
    expect(testProps.onValueChange).not.toHaveBeenCalled();
  });
});
