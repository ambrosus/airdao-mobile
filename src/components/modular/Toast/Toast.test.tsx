import React from 'react';
import { act, render } from '@testing-library/react-native';
import { Toast, ToastType } from '.';
import { SafeAreaProvider } from 'react-native-safe-area-context';
jest.mock('react-native-reanimated', () => ({
  SlideInDown: {
    duration: () => 2000
  },
  SlideInUp: {
    duration: () => 2000
  },
  SlideOutDown: {
    duration: () => 2000
  },
  SlideOutUp: {
    duration: () => 2000
  }
}));

describe('Toast Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  // TODO
  it('should render without crashing', () => {
    const { queryByTestId } = render(
      <SafeAreaProvider>
        <Toast />
      </SafeAreaProvider>
    );
    expect(queryByTestId('toast')).toBe(null);
  });

  //   it('should show a toast with correct message and type', () => {
  //     const message = 'Test message';
  //     const type = ToastType.Bottom;

  //     jest.runAllTimers();

  //     const { getByText } = render(
  //       <SafeAreaProvider>
  //         <Toast />
  //       </SafeAreaProvider>
  //     );
  //     act(() => Toast.show({ message, type }));
  //     expect(getByText(message)).toBeDefined();
  //   });

  //   it('should hide the toast after the given duration', () => {
  //     const duration = 3000;
  //     const type = ToastType.Bottom;
  //     const { queryByTestId } = render(
  //       <SafeAreaProvider>
  //         <Toast />
  //       </SafeAreaProvider>
  //     );
  //     act(() => Toast.show({ message: 'Test message', duration, type }));

  //     expect(setTimeout).toHaveBeenCalledTimes(1);
  //     expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), duration);
  //     act(() => Toast.hide());
  //     jest.runAllTimers();
  //     expect(queryByTestId('toast')).toBeNull();
  //   });

  //   it('should hide the toast when the close button is pressed', () => {
  //     const { queryByTestId, getByTestId } = render(
  //       <SafeAreaProvider>
  //         <Toast />
  //       </SafeAreaProvider>
  //     );
  //     act(() => Toast.show({ message: 'Test message', type: ToastType.Top }));

  //     getByTestId('toast-close-button').props.onPress();
  //     expect(queryByTestId('toast')).toBeNull();
  //   });
  //   it('should call the onUndo function when undo is pressed', () => {
  //     const onUndo = jest.fn();

  //     const { getByText } = render(
  //       <SafeAreaProvider>
  //         <Toast />
  //       </SafeAreaProvider>
  //     );
  //     act(() =>
  //       Toast.show({ message: 'Test message', onUndo, type: ToastType.Top })
  //     );
  //     getByText('Undo').props.onPress();

  //     expect(onUndo).toHaveBeenCalledTimes(1);
  //   });
});
