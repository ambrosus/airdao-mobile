import { render } from '@testing-library/react-native';
import React from 'react';
import { Spinner } from '.';
import { COLORS } from '@constants/colors';

describe('Spinner Component', () => {
  it('should render correctly', () => {
    const { getByTestId } = render(<Spinner testID="spinner" />);
    const spinner = getByTestId('spinner');
    expect(spinner).toBeDefined();
  });
  it('should render correctly with default props', () => {
    const { getByTestId } = render(<Spinner testID="spinner" />);
    const spinner = getByTestId('spinner');
    expect(spinner.props.size).toEqual('small');
    expect(spinner.props.color).toEqual(COLORS.grey);
  });
  it('should render correctly with specified size', () => {
    const { getByTestId } = render(<Spinner testID="spinner" size="large" />);
    const spinner = getByTestId('spinner');
    expect(spinner.props.size).toEqual('large');
    expect(spinner.props.color).toEqual(COLORS.grey);
  });
});
