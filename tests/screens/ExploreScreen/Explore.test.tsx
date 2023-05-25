import React from 'react';
import { render } from '@testing-library/react-native';
import { ExploreScreen } from '@screens/Explore';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({
    params: { address: '' }
  }),
  useNavigation: jest.fn()
}));

jest.mock('@contexts/OnBoardingContext', () => ({
  useOnboardingStatus: jest.fn(() => ({
    status: 'none',
    back: jest.fn(),
    skip: jest.fn()
  }))
}));

jest.mock('@contexts/AllAddresses', () => ({
  useAllAddressesReducer: jest.fn(() => ({
    address: [
      {
        _id: '6200de3b523162b8b87baff1',
        address: '0xF977814e90dA44bFA03b6295A0616a897441aceC',
        ambBalance: 1154670697.424454,
        transactionCount: 17,
        type: 'undefined',
        name: ''
      }
    ]
  })),
  useAllAddresses: jest.fn(() => {
    return [];
  })
}));

jest.mock('victory-native', () => {
  return {
    VictoryChart: jest.fn(),
    VictoryTheme: {},
    VictoryLine: jest.fn(),
    VictoryAxis: jest.fn()
  };
});

const mockedData = {
  data: [
    {
      _id: '6200de3b523162b8b87baff1',
      address: '0xF977814e90dA44bFA03b6295A0616a897441aceC',
      ambBalance: 1154670697.424454,
      transactionCount: 17,
      type: 'undefined',
      name: '',
      calculatePercentHoldings: () => 4
    }
  ],
  loading: false,
  error: false
};

jest.mock('@hooks/query/useExplorerAccounts', () => ({
  useExplorerAccounts: jest.fn(() => mockedData)
}));

jest.mock('@hooks/query/useExplorerInfo', () => ({
  useExplorerInfo: jest.fn(() => ({
    data: []
  }))
}));

const queryClient = new QueryClient();

const Component = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ExploreScreen />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};
describe('ExploreScreen', () => {
  it('renders correctly', async () => {
    const { getByTestId } = render(<Component />);
    expect(getByTestId('explore-screen')).toBeTruthy();
    expect(getByTestId('explore-screen-kdv')).toBeTruthy();
  });

  it('renders SearchAddress', () => {
    const { getByTestId } = render(<Component />);
    expect(getByTestId('search-address')).toBeTruthy();
  });

  it('renders KeyboardDismissingView', () => {
    const { getByTestId } = render(<Component />);
    expect(getByTestId('explore-screen-kdv')).toBeTruthy();
  });
});
