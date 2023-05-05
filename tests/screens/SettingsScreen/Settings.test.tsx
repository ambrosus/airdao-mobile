import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { SettingsScreen } from '@screens/Settings';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SettingsInfoBlock } from '@screens/Settings/components/SettingsInfoBlock';
import { SettingsBlock } from '@screens/Settings/components/SettingsBlock';

jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default
);

jest.mock('@helpers/createContextSelector', () => ({
  createContextSelector: () => [{}, jest.fn()]
}));

jest.mock('@hooks/query/useAMBPrice', () => ({
  useAMBPrice: jest.fn(() => ({
    data: 123123,
    loading: false,
    error: undefined
  }))
}));

jest.mock('@hooks', () => ({
  useFullscreenModalHeight: () => []
}));

const mockFocus = jest.fn();
jest.spyOn(React, 'useRef').mockImplementation(() => ({
  current: {
    focus: mockFocus
  }
}));

jest.mock('@components/templates', () => {
  return {
    BottomSheetSelectBaseCurrency: () => null,
    BottomSheetNotificationSettings: () => null,
    BottomSheetSelectLanguage: () => null
  };
});

jest.mock('victory-native', () => ({}));

jest.mock('react-native-share', () => ({}));

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: jest.fn(),
    useRoute: jest.fn()
  };
});

const queryClient = new QueryClient();

describe('SettingsScreen', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('renders the SettingsBlock and SettingsInfoBlock components', async () => {
    const { getByTestId } = render(
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <SettingsScreen />
        </QueryClientProvider>
      </SafeAreaProvider>
    );

    const settingsScreen = getByTestId('settings-screen');
    const settingsBlock = getByTestId('settings-screen_settings-block');
    const settingsInfoBlock = getByTestId('setting-screen_settings-info-block');
    expect(settingsBlock).toBeTruthy();
    expect(settingsScreen).toBeTruthy();
    expect(settingsInfoBlock).toBeTruthy();
  });
});

describe('SettingsInfoBlock', () => {
  it('renders the text inside settings-screen_settings-info-block inside the button', () => {
    const { getByText } = render(<SettingsInfoBlock />);
    expect(getByText('About AirDAO')).not.toBeNull();
    expect(getByText('Help center')).not.toBeNull();
    expect(getByText('Rate us on the App Store')).not.toBeNull();
  });
});

describe('SettingsBlock', () => {
  it('should render correctly on ios', () => {
    jest.mock('react-native/Libraries/Utilities/Platform', () => ({
      OS: 'ios'
    }));
    const { getByTestId } = render(<SettingsBlock />);
    const settingsBlock = getByTestId('settings-screen_settings-block');
    expect(settingsBlock).toBeDefined();
  });
});

describe('SettingsBlock', () => {
  it('should render correctly on android', () => {
    jest.mock('react-native/Libraries/Utilities/Platform', () => ({
      OS: 'android'
    }));
    const { getByTestId } = render(<SettingsBlock />);
    const settingsBlock = getByTestId('settings-screen_settings-block');
    expect(settingsBlock).toBeDefined();
  });
});

describe('SettingsBlock component', () => {
  it('should render the base currency option', () => {
    const { getByText } = render(<SettingsBlock />);
    expect(getByText('Base currency')).not.toBeNull();
  });

  it('should open the base currency modal on press', () => {
    const { getByText, getByTestId } = render(<SettingsBlock />);
    fireEvent.press(getByText('Base currency'));
    expect(getByTestId('bottom-sheet-select-base-currency')).not.toBeNull();
  });

  it('should render the language option', () => {
    const { getByText } = render(<SettingsBlock />);
    expect(getByText('Language')).not.toBeNull();
  });

  it('should open the language modal on press', () => {
    const { getByText, getByTestId } = render(<SettingsBlock />);
    fireEvent.press(getByText('Language'));
    expect(getByTestId('bottom-sheet-select-language')).not.toBeNull();
  });

  it('should render the notification settings option', () => {
    const { getByText } = render(<SettingsBlock />);
    expect(getByText('Notification settings')).not.toBeNull();
  });

  it('should open the notification settings modal on press', () => {
    const { getByText, getByTestId } = render(<SettingsBlock />);
    fireEvent.press(getByText('Notification settings'));
    expect(getByTestId('bottom-sheet-notification-settings')).not.toBeNull();
  });
});
