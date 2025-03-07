
import { render } from '@testing-library/react-native';
import { SettingsScreen } from '@screens/Settings';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import clearAllMocks = jest.clearAllMocks;

jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default
);

jest.mock('@utils/createContextSelector', () => ({
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

jest.mock('react-native-share', () => ({}));

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: jest.fn(),
    useRoute: jest.fn()
  };
});

jest.mock('@hooks', () => ({
  useForwardedRef: jest.fn(),
  useFullscreenModalHeight: () => []
}));

const queryClient = new QueryClient();

describe('SettingsScreen', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
    clearAllMocks();
  });

  it('renders the SettingsBlock and SettingsInfoBlock components', async () => {
    const { getByTestId } = render(
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <SettingsScreen />
        </QueryClientProvider>
      </SafeAreaProvider>
    );

    const settingsScreen = getByTestId('Settings_Screen');
    const settingsBlock = getByTestId('Settings_Screen_Settings_Block');
    const settingsInfoBlock = getByTestId(
      'Settings_Screen_Settings_Info_Block'
    );
    expect(settingsBlock).toBeTruthy();
    expect(settingsScreen).toBeTruthy();
    expect(settingsInfoBlock).toBeTruthy();
  });
});
