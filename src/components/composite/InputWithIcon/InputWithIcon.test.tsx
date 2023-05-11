import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { InputWithIcon } from '.';
import { AddIcon } from '@components/svg/icons/AddIcon';

describe('InputWithIcon Component', () => {
  it('renders correctly with left and right icons', () => {
    const { getByTestId } = render(
      <InputWithIcon
        testID="input"
        iconLeft={<AddIcon testID="icon-left" />}
        iconRight={<AddIcon testID="icon-right" />}
        placeholder="Enter text here"
      />
    );

    expect(getByTestId('input')).toBeDefined();
    expect(getByTestId('icon-left')).toBeDefined();
    expect(getByTestId('icon-right')).toBeDefined();
  });

  it('calls the onChangeText callback when text is entered', () => {
    const onChangeText = jest.fn();
    const { getByTestId } = render(
      <InputWithIcon testID="input" onChangeText={onChangeText} />
    );

    fireEvent.changeText(getByTestId('input'), 'Hello World');

    expect(onChangeText).toHaveBeenCalledTimes(1);
    expect(onChangeText).toHaveBeenCalledWith('Hello World');
  });
});
