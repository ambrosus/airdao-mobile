import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { COLORS } from '@constants/colors';
import { NotificationSettingsView } from './index';
import clearAllMocks = jest.clearAllMocks;

jest.mock('react-native-modal', () => {
  return ({ children }: { children: React.ReactNode }) => <>{children}</>;
});

jest.mock('@react-native-firebase/messaging', () => {
  return () => ({
    getToken: jest.fn(() => Promise.resolve('mock-token')),
    onTokenRefresh: jest.fn()
  });
});

const queryClient = new QueryClient();

const Component = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NotificationSettingsView />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

describe('NotificationSettings', () => {
  afterAll(() => {
    clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByTestId } = render(<Component />);
    const settingsModal = getByTestId('NotificationSettings_Container');
    expect(settingsModal).toBeTruthy();
  });

  it.skip('toggles price alerts switch', async () => {
    const { getByTestId } = render(<Component />);
    const priceAlertsSwitch = getByTestId(
      'BottomSheetNotiSettings_Price_Switch'
    );
    expect(priceAlertsSwitch.props.value).toBe(true);
    act(() => {
      fireEvent.press(priceAlertsSwitch);
    });
    expect(priceAlertsSwitch.props.value).toBe(false);
  }); // TODO rewrite this test with new design

  it('selects segment in segmented picker', async () => {
    const { getAllByTestId } = render(<Component />);
    const segment = getAllByTestId(`SegmentButton_2`)[0];
    expect(segment.props.style).toStrictEqual({
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 15.694117647058823,
      opacity: 1
    });
    await act(async () => {
      fireEvent.press(segment);
    });
    expect(segment.props.style).toStrictEqual({
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 15.694117647058823,
      shadowColor: COLORS.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1,
      elevation: 1,
      backgroundColor: COLORS.neutral0,
      borderRadius: 56.57142857142857,
      opacity: 1
    });
  });
});
