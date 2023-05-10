import { render } from '@testing-library/react-native';
import React from 'react';
import { Row } from '.';
import { View } from 'react-native';

describe('Row Component', () => {
  it('should render correctly', () => {
    const { getByTestId } = render(<Row testID="row" />);
    const row = getByTestId('row');
    expect(row).toBeDefined();
  });
  it('should have flex direction row with default styles', () => {
    const { getByTestId } = render(<Row testID="row" />);
    const row = getByTestId('row');
    expect(row.props.style).toHaveProperty('flexDirection', 'row');
  });
  it('should render flex row with custom styles flexDirection: column', () => {
    const { getByTestId } = render(
      <Row testID="row" style={{ flexDirection: 'column' }} />
    );
    const row = getByTestId('row');
    expect(row.props.style).toHaveProperty('flexDirection', 'row');
  });
  it('should render correctly with custom styles', () => {
    const { getByTestId } = render(
      <Row
        testID="row"
        style={{ width: 200, height: 50, flexDirection: 'column' }}
        alignItems="center"
        justifyContent="space-between"
        width={150}
        flex={5}
      >
        <View testID="child-1" />
        <View testID="child-2" />
      </Row>
    );
    const row = getByTestId('row');
    expect(row.props.style).toEqual({
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      width: 150,
      height: 50,
      flex: 5
    });
    expect(getByTestId('child-1')).toBeDefined();
    expect(getByTestId('child-2')).toBeDefined();
  });
});
