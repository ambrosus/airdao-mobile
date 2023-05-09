import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { BaseButton } from '../../base/Button/Button.Base';
import { Text } from 'react-native';

describe('BaseButton', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <BaseButton>
        <Text>Press me</Text>
      </BaseButton>
    );
    const button = getByText('Press me');
    expect(button).toBeDefined();
  });

  it('calls onPress when button is pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <BaseButton onPress={onPress}>
        <Text>Press me</Text>
      </BaseButton>
    );
    const button = getByText('Press me');
    fireEvent.press(button);
    expect(onPress).toHaveBeenCalled();
  });

  it('does not call onPress when button is disabled', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <BaseButton onPress={onPress} disabled={true}>
        <Text>Press me</Text>
      </BaseButton>
    );
    const button = getByText('Press me');
    fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });
});
