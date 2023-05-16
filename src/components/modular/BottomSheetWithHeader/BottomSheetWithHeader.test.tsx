import React, { createRef } from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { BottomSheetWithHeader } from '.';
import { Text } from '@components/base';
import { BottomSheetRef } from '@components/composite';

jest.mock('@contexts/OnboardingContext', () => ({
  useOnboardingStatus: jest.fn(() => ({
    status: 'none',
    skip: jest.fn(),
    back: jest.fn()
  }))
}));

jest.mock('@hooks', () => ({
  useOnboardingToolTip: jest.fn(() => ({
    title: '',
    subtitle: '',
    buttonRightTitle: '',
    buttonLeftTitle: '',
    isButtonLeftVisible: ''
  })),
  useRef: jest.fn(),
  useForwardedRef: jest.fn(),
  useState: jest.fn(),
  useFullscreenModalHeight: jest.fn()
}));

describe('BottomSheetWithHeader Component', () => {
  it('renders header title correctly', () => {
    const ref = createRef<BottomSheetRef>();
    const { getByText } = render(
      <BottomSheetWithHeader title="Test Title" ref={ref}>
        <Text>Test Content</Text>
      </BottomSheetWithHeader>
    );
    act(() => ref.current?.show());
    expect(getByText('Test Title')).toBeDefined();
  });

  it('calls onActionPress callback when action button is pressed', () => {
    const onActionPress = jest.fn();
    const ref = createRef<BottomSheetRef>();
    const { getByText } = render(
      <BottomSheetWithHeader
        ref={ref}
        title="Test Title"
        actionTitle="Test Action"
        onActionPress={onActionPress}
      >
        <Text>Test Content</Text>
      </BottomSheetWithHeader>
    );
    act(() => ref.current?.show());
    fireEvent.press(getByText('Test Action'));
    expect(onActionPress).toHaveBeenCalledTimes(1);
  });
  it('calls dismiss on header CloseIcon press', () => {
    const onActionPress = jest.fn();
    const ref = createRef<BottomSheetRef>();
    const { getByTestId } = render(
      <BottomSheetWithHeader
        ref={ref}
        title="Test Title"
        actionTitle="Test Action"
        onActionPress={onActionPress}
      >
        <Text>Test Content</Text>
      </BottomSheetWithHeader>
    );
    act(() => ref.current?.show());
    if (ref.current?.dismiss) {
      ref.current.dismiss = jest.fn();
      act(() =>
        fireEvent.press(getByTestId('bottom-sheet-with-header-close-icon'))
      );
      expect(ref.current.isVisible).toBe(false);
    }
  });
});
