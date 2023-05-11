import React, { createRef } from 'react';
import { Keyboard } from 'react-native';
import { act, render } from '@testing-library/react-native';
import { BottomSheet, BottomSheetRef } from '.';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text } from '@components/base';

describe('BottomSheet Component', () => {
  it('should render correctly', () => {
    const { getByTestId } = render(
      <SafeAreaProvider>
        <BottomSheet testID="bottom-sheet" />
      </SafeAreaProvider>
    );
    const modal = getByTestId('bottom-sheet');
    expect(modal).toBeDefined();
  });
  it('should show the modal when calling show', () => {
    const modalRef = createRef<BottomSheetRef>();
    render(
      <SafeAreaProvider>
        <BottomSheet ref={modalRef} />
      </SafeAreaProvider>
    );
    expect(modalRef.current?.isVisible).toBe(false);
    act(() => modalRef.current?.show());
    expect(modalRef.current?.isVisible).toBe(true);
  });
  it('should hide the modal when calling dismiss', () => {
    const modalRef = createRef<BottomSheetRef>();
    render(
      <SafeAreaProvider>
        <BottomSheet ref={modalRef} />
      </SafeAreaProvider>
    );
    act(() => modalRef.current?.show());
    expect(modalRef.current?.isVisible).toBe(true);
    act(() => modalRef.current?.dismiss());
    expect(modalRef.current?.isVisible).toBe(false);
  });
  it('should call onClose when dismissed', () => {
    const modalRef = createRef<BottomSheetRef>();
    const onClose = jest.fn();
    render(
      <SafeAreaProvider>
        <BottomSheet ref={modalRef} onClose={onClose} />
      </SafeAreaProvider>
    );
    act(() => modalRef.current?.show());
    act(() => modalRef.current?.dismiss());
    expect(onClose).toHaveBeenCalledTimes(1);
  });
  it('should have content with specified height', () => {
    const modalRef = createRef<BottomSheetRef>();
    const onClose = jest.fn();
    const TEST_HEIGHT = 200;
    const { getByTestId } = render(
      <SafeAreaProvider>
        <BottomSheet
          ref={modalRef}
          onClose={onClose}
          height={TEST_HEIGHT}
          testID="bottom-sheet"
        />
      </SafeAreaProvider>
    );
    act(() => modalRef.current?.show());
    const content = getByTestId('bottom-sheet-content');
    expect(content.props.style).toHaveProperty('height', TEST_HEIGHT);
  });
  it('should have content with specified borderRadius', () => {
    const modalRef = createRef<BottomSheetRef>();
    const onClose = jest.fn();
    const TEST_BORDER_RADIUS = 20;
    const { getByTestId } = render(
      <SafeAreaProvider>
        <BottomSheet
          ref={modalRef}
          onClose={onClose}
          borderRadius={TEST_BORDER_RADIUS}
          testID="bottom-sheet"
        />
      </SafeAreaProvider>
    );
    act(() => modalRef.current?.show());
    const content = getByTestId('bottom-sheet-content');
    expect(content.props.style).toHaveProperty(
      'borderTopLeftRadius',
      TEST_BORDER_RADIUS
    );
    expect(content.props.style).toHaveProperty(
      'borderTopRightRadius',
      TEST_BORDER_RADIUS
    );
  });
  it('should render the children', async () => {
    const modalRef = createRef<BottomSheetRef>();
    const { getByTestId } = render(
      <SafeAreaProvider>
        <BottomSheet ref={modalRef}>
          <Text testID="child">Child</Text>
        </BottomSheet>
      </SafeAreaProvider>
    );
    act(() => modalRef.current?.show());
    expect(getByTestId('child')).toBeDefined();
  });
  it('should close keyboard on dismiss', () => {
    const modalRef = createRef<BottomSheetRef>();
    render(
      <SafeAreaProvider>
        <BottomSheet ref={modalRef} />
      </SafeAreaProvider>
    );
    act(() => modalRef.current?.show());
    Keyboard.dismiss = jest.fn();
    act(() => modalRef.current?.dismiss());
    expect(Keyboard.dismiss).toHaveBeenCalled();
  });
});
