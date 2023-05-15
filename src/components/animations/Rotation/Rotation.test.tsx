import React from 'react';
import { render } from '@testing-library/react-native';
import { ChevronDownIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { RotationAnimation } from '@components/animations';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = (func: () => void) => {
    func();
  };
  return Reanimated;
});

describe('RotationAnimation', () => {
  it('renders the component with default props', () => {
    const { getByTestId } = render(
      <RotationAnimation>
        <ChevronDownIcon color={COLORS.smokyBlack} />
      </RotationAnimation>
    );
    expect(getByTestId('AnimatedView')).toBeTruthy();
  });
});
