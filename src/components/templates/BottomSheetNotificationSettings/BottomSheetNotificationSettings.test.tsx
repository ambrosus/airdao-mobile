import React from 'react';
import { BottomSheetNotificationSettings } from '@components/templates';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render } from '@testing-library/react-native';
import { Platform } from 'react-native';

jest.mock('react-native-modal', () => {
  return ({ children }: { children: React.ReactNode }) => <>{children}</>;
});

jest.mock('victory-native', () => {
  return {
    VictoryChart: jest.fn(),
    VictoryTheme: {},
    VictoryLine: jest.fn(),
    VictoryAxis: jest.fn()
  };
});

const queryClient = new QueryClient();

const Component = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <BottomSheetNotificationSettings />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

describe('BottomSheetNotificationSettings', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<Component />);
    const settingsModal = getByTestId('BottomSheetNotiSettings_Container');
    expect(settingsModal).toBeTruthy();
  });

  it('updates price threshold when input values change', async () => {
    const { getByTestId } = render(<Component />);
    const settingsModal = getByTestId('BottomSheetNotiSettings_Container');
    expect(settingsModal).toBeTruthy();
    const minInput = getByTestId('BottomSheetNoti_Min_input');
    const maxInput = getByTestId('BottomSheetNoti_Max_input');
    act(() => {
      fireEvent.changeText(minInput, '10');
    });
    expect(minInput.props.value).toBe('10');
    act(() => {
      fireEvent.changeText(maxInput, '20');
    });
    expect(maxInput.props.value).toBe('20');
  });

  it('toggles price alerts switch', async () => {
    const { getByTestId } = render(<Component />);
    const priceAlertsSwitch = getByTestId(
      'BottomSheetNotiSettings_Price_Switch'
    );
    expect(priceAlertsSwitch.props.value).toBe(true);
    act(() => {
      fireEvent.press(priceAlertsSwitch);
    });
    expect(priceAlertsSwitch.props.value).toBe(false);
  });

  it('selects segment in segmented picker', async () => {
    const { getAllByTestId } = render(<Component />);
    const segment = getAllByTestId(`SegmentButton_8`)[0];
    expect(segment.props.style).toStrictEqual({
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 17.655882352941177,
      opacity: 1
    });
    act(() => {
      fireEvent.press(segment);
    });
    expect(segment.props.style).toStrictEqual({
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 17.655882352941177,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1,
      elevation: 1,
      backgroundColor: '#FFFFFF',
      borderRadius: 56.57142857142857,
      opacity: 1
    });
  });

  it('renders Save float button at the bottom of the screen on ANDROID', () => {
    jest.mock('react-native/Libraries/Utilities/Platform', () => ({
      OS: 'android'
    }));
    const { getByTestId } = render(<Component />);
    const floatButton = getByTestId('BottomSheetNoti_Save_Button');
    expect(floatButton).toBeDefined();
  });

  it('renders Save button icon correctly ANDROID', () => {
    jest.mock('react-native/Libraries/Utilities/Platform', () => ({
      OS: 'android'
    }));
    const { getByTestId } = render(<Component />);
    const saveButtonIcon = getByTestId('BottomSheetNotiSettings_Header_Left');
    if (Platform.OS === 'ios') {
      expect(saveButtonIcon.props.children[0].props.testID).toBe(
        'BottomSheetNotiSettings_Header_Close_Icon'
      );
    } else {
      expect(saveButtonIcon.props.children[0].props.testID).toBe(
        'BottomSheetNotiSettings_Header_Back_Icon'
      );
    }
  });
});
