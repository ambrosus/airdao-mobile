import React from 'react';
import { render } from '@testing-library/react-native';
import { Spacer } from '.';

describe('Spacer Component', () => {
  it('should render correctly', () => {
    const { getByTestId } = render(<Spacer testID="spacer" />);
    const spacer = getByTestId('spacer');
    expect(spacer).toBeDefined();
  });
  it('should render a vertical spacer with the specified height', () => {
    const { getByTestId } = render(<Spacer value={10} testID="spacer" />);
    const spacer = getByTestId('spacer');
    expect(spacer.props.style).toHaveProperty('height', 10);
  });
  it('should render a vertical spacer with the specified width', () => {
    const { getByTestId } = render(
      <Spacer horizontal value={10} testID="spacer" />
    );
    const spacer = getByTestId('spacer');
    expect(spacer.props.style).toHaveProperty('width', 10);
  });
});
