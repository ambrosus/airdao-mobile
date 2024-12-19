import React from 'react';
import { render } from '@testing-library/react-native';
import { RotationAnimation } from '@components/animations';
import { ChevronDownIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';

jest.mock('react-native-reanimated', () => {
  const Reanimated = jest.requireActual('react-native-reanimated/mock');
  Reanimated.default.call = (func: () => void) => {
    func();
  };
  return Reanimated;
});

describe('RotationAnimation', () => {
  it('renders the component with default props', () => {
    const { getByTestId } = render(
      <RotationAnimation>
        <ChevronDownIcon color={COLORS.neutral900} />
      </RotationAnimation>
    );
    expect(getByTestId('AnimatedView')).toBeTruthy();
  });
});
