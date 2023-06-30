import React from 'react';
import { render } from '@testing-library/react-native';
import { HomeScreen } from '@screens/Wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

jest.mock('react-native-graph', () => ({
  LineGraph: jest.fn(),
  GraphPoint: jest.fn()
}));

jest.mock('@contexts/OnBoardingContext', () => ({
  useOnboardingStatus: jest.fn(() => ({
    status: 'none',
    back: jest.fn(),
    skip: jest.fn(),
    start: jest.fn()
  }))
}));

let mockedData = [
  {
    _id: '123123',
    address: '123123123',
    ambBalance: 100,
    transactionCount: 1,
    type: 'account',
    name: 'asdasdasd'
  }
];

let mockedNotificationsData = [{}];

jest.mock('@hooks', () => ({
  useForwardedRef: jest.fn(),
  useFullscreenModalHeight: () => [],
  useAMBPrice: jest.fn(() => ({
    data: {
      _id: '123123',
      id: 123,
      name: '123123',
      symbol: '123',
      circulatingSupply: 123123,
      maxSupply: null,
      totalSupply: 123123,
      rank: 123,
      percentChange1H: 123,
      percentChange24H: 123,
      percentChange7D: 123,
      priceUSD: 123,
      volumeUSD: 3333,
      marketCapUSD: 111
    },
    loading: false,
    error: undefined
  })),
  usePersonalList: jest.fn(() => ({
    personalList: mockedData
  })),
  useWatchlist: jest.fn(() => ({
    watchlist: mockedData
  })),
  useNotificationsQuery: jest.fn(() => ({
    data: mockedNotificationsData
  })),
  useInitialMountEffect: jest.fn((fn, when) => {
    if (when) {
      fn();
    }
  }),
  useAMBPriceHistorical: jest.fn(() => ({
    data: []
  }))
}));

jest.mock('@contexts/AllAddresses', () => ({
  useAllAddresses: jest.fn(() => {
    return [];
  }),
  useAllAddressesReducer: jest.fn()
}));

jest.mock('@shopify/react-native-skia', () => ({
  runSpring: jest.fn(),
  useValue: jest.fn(),
  Circle: jest.fn(),
  Group: jest.fn()
}));

jest.mock('@contexts', () => ({
  useLists: jest.fn(() => ({
    handleOnCreate: jest.fn(),
    listsOfAddressGroup: []
  })),
  useOnboardingStatus: jest.fn(() => ({
    start: jest.fn()
  }))
}));

const queryClient = new QueryClient();

const Component = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <HomeScreen />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};
describe('Home Screen', () => {
  it('renders correctly', async () => {
    mockedNotificationsData = [];
    const { getByTestId } = render(<Component />);
    expect(getByTestId('Home_Screen')).toBeDefined();
    // expect(getByTestId('Notifications_Button')).toBeDefined();
    // expect(getByTestId('Scanner_Button')).toBeDefined();
    // expect(getByTestId('Collection')).toBeDefined();
    // expect(getByTestId('Watchlists')).toBeDefined();
    // expect(getByTestId('Portfolio_Balance')).toBeDefined();
    // expect(getByTestId('Home_Tabs')).toBeDefined();
    // expect(getByTestId('Home_Watchlists')).toBeDefined();
    // expect(getByTestId('Home_Collections')).toBeDefined();
    // expect(getByTestId('Home_Tabs_ScrollView')).toBeDefined();
    // expect(getByTestId('Watchlists_Button')).toBeDefined();
    // expect(getByTestId('Collections_Button')).toBeDefined();
  });

  it('WatchList Tab should be empty when there are no addresses inside', async () => {
    mockedData = [];
    const { getAllByTestId } = render(<Component />);
    expect(getAllByTestId('empty-list')).toBeDefined();
  });

  it('WatchList Tab should have a mocked address inside', async () => {
    mockedData = [
      {
        _id: '123123',
        address: '123123123',
        ambBalance: 100,
        transactionCount: 1,
        type: 'account',
        name: 'Mocked Address'
      }
    ];
    const { getByText } = render(<Component />);
    expect(getByText('Mocked Address')).toBeDefined();
    expect(getByText('$12,300')).toBeDefined();
  });
});

// TODO test for notifications and scanner buttons
// TODO test if there are any items in collections tab
// TODO test if there are any items in watchlists tab
// TODO test if portfolio balance is shown correctly with mocked data
// TODO test that Watchlists_Button and Collections_Button are pressable and calls correct bottom sheets on the screen
