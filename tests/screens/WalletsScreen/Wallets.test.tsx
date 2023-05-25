import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { HomeScreen } from '@screens/Wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

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
  }))
}));

jest.mock('@contexts/AllAddresses', () => ({
  useAllAddresses: jest.fn(() => {
    return [];
  }),
  useAllAddressesReducer: jest.fn()
}));

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
        <HomeScreen />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};
describe('HomeScreen', () => {
  it('renders correctly', async () => {
    const { getByTestId } = render(<Component />);
    expect(getByTestId('Wallets_Screen')).toBeDefined();
    expect(getByTestId('Wallets_List')).toBeDefined();
    expect(getByTestId('Watchlists')).toBeDefined();
  });

  it('renders PortfolioBalance with correct props', () => {
    const { getByTestId } = render(<Component />);
    const portfolioBalance = getByTestId('Portfolio_Balance_Title');
    expect(portfolioBalance.props.children).toEqual(['$', '12,300.00']);
    const usdBalance = getByTestId('Portfolio_Balance_USDBalance');
    expect(usdBalance.props.children).toBeTruthy();
  });

  it('LearnAboutAirDAO component is rendered only on iOS', () => {
    const { getByTestId } = render(<Component />);
    if (Platform.OS === 'ios') {
      const learnAboutAirDAOComponent = getByTestId('Learn_About_AirDAO');
      expect(learnAboutAirDAOComponent).toBeTruthy();
    } else {
      const learnAboutAirDAOComponent = getByTestId('Learn_About_AirDAO');
      expect(learnAboutAirDAOComponent).toBeNull();
    }
  });

  it('WatchList should be empty when there are any wallets inside', async () => {
    mockedData = [];
    const { getByTestId } = render(<Component />);
    const toggleButton = getByTestId('ToggleButton_Wallets');
    await fireEvent.press(toggleButton);
    expect(getByTestId('empty-list')).toBeDefined();
  });

  it('WatchList should not be empty when there are any wallets inside', async () => {
    mockedData = [
      {
        _id: '123123',
        address: '123123123',
        ambBalance: 100,
        transactionCount: 1,
        type: 'account',
        name: 'asdasdasd'
      }
    ];
    const { getByTestId } = render(<Component />);
    const toggleButton = getByTestId('ToggleButton_WatchList');
    await fireEvent.press(toggleButton);
    expect(getByTestId('WalletItem_0')).toBeDefined();
  });
});
