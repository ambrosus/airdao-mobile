import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { RadioButton } from '.';

describe('RadioButton Component', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(
      <RadioButton
        testID="radio_button"
        isActive={true}
        onPress={() => undefined}
      />
    );
    const radioButton = getByTestId('radio_button');
    expect(radioButton).toBeDefined();
  });
  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <RadioButton testID="radio_button" isActive={true} onPress={onPress} />
    );
    const radioButton = getByTestId('radio_button');
    fireEvent.press(radioButton);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
  it('renders active radio button when isActive is true', () => {
    const { getByTestId } = render(
      <RadioButton isActive={true} onPress={() => null} />
    );
    const radioButtonActive = getByTestId('radio-button-active');
    expect(radioButtonActive).toBeDefined();
  });
  it('renders active radio button when isActive is true', () => {
    const { getByTestId } = render(
      <RadioButton isActive={false} onPress={() => null} />
    );
    const radioButtonInactive = getByTestId('radio-button-inactive');
    expect(radioButtonInactive).toBeDefined();
  });
});
