import { fireEvent, render } from '@testing-library/react-native';
import { KeyboardDismissingView } from '.';
import React from 'react';
import { Keyboard } from 'react-native';

describe('KeyboardDismissingView Component', () => {
  it('should render correctly', () => {
    const { getByTestId } = render(<KeyboardDismissingView testID="kdv" />);
    const kdv = getByTestId('kdv');
    expect(kdv).toBeDefined();
  });
  it('should dismiss keyboard on touch', () => {
    const { getByTestId } = render(<KeyboardDismissingView testID="kdv" />);
    const kdv = getByTestId('kdv');
    Keyboard.dismiss = jest.fn();
    fireEvent(kdv, 'responderRelease');
    expect(Keyboard.dismiss).toHaveBeenCalledTimes(1);
  });
  it('should not dismiss keyboard on touch when disabled', () => {
    const { getByTestId } = render(
      <KeyboardDismissingView disabled testID="kdv" />
    );
    const kdv = getByTestId('kdv');
    Keyboard.dismiss = jest.fn();
    fireEvent(kdv, 'responderRelease');
    expect(Keyboard.dismiss).not.toHaveBeenCalled();
  });
});
