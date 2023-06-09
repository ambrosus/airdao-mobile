import React from 'react';
import { render } from '@testing-library/react-native';
import { SettingsScreen } from '@screens/Settings';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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
