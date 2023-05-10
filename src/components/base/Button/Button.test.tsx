import React from 'react';
import { render } from '@testing-library/react-native';
import { Button } from '.';
import { Text } from '../Text';

describe('Button Component', () => {
  it('should render BaseButton by default', () => {
    const { getByTestId } = render(<Button />);
    const baseButton = getByTestId('base-button');
    expect(baseButton).toBeDefined();
  });
  test('should render base button with text content', () => {
    const { getByText } = render(
      <Button>
        <Text>Press me</Text>
      </Button>
    );
    const buttonText = getByText('Press me');
    expect(buttonText).toBeDefined();
  });
  it('should render bordered button', () => {
    const { getByTestId } = render(<Button type="bordered" />);
    const borderedButton = getByTestId('bordered-button');
    expect(borderedButton).toBeDefined();
  });
  it('should render circular button', () => {
    const { getByTestId } = render(<Button type="circular" />);
    const circularButton = getByTestId('circular-button');
    expect(circularButton).toBeDefined();
  });
});
