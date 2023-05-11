import React from 'react';
import { render } from '@testing-library/react-native';
import { PercentChange } from '.';

describe('PercentChange', () => {
  it('should render a positive change with a green color', () => {
    const { getByText } = render(<PercentChange change={0.5} />);
    const textElement = getByText('0.50%');
    expect(textElement).toBeDefined();
  });
  it('should use the specified font size and weight', () => {
    const { getByText } = render(
      <PercentChange change={0.5} fontSize={16} fontWeight="600" />
    );
    const textElement = getByText('0.50%');
    expect(textElement).toBeDefined();
    expect(textElement.props.style).toHaveProperty('fontWeight', '600');
    expect(textElement.props.style).toHaveProperty('fontSize', 16);
  });

  it('should render with the specified color', () => {
    const { getByTestId } = render(<PercentChange change={0.5} color="red" />);
    const textElement = getByTestId('percent-change-text');
    expect(textElement.props.style).toHaveProperty('color', 'red');
  });
});
