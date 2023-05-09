import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
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

jest.mock('@contexts/OnBoardingUserContext', () => ({
  useOnboardingStatus: jest.fn(() => ({
    status: 'none'
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

let mockedData = {
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
  });

  it('input is visible', async () => {
    const { getByTestId } = render(<Component />);
    expect(getByTestId('search-input')).not.toBeNull();
  });

  it('opens filter modal when filter button pressed', async () => {
    const { getByTestId } = render(<Component />);
    const filterButton = getByTestId('filter-button');
    fireEvent.press(filterButton);
    await new Promise((res) => setTimeout(res, 1000));
    expect(getByTestId('bottom-sheet-wallet-sort')).toBeDefined();
  });

  it('displays loading spinner while loading accounts', async () => {
    mockedData = {
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
      loading: true,
      error: false
    };
    const { getByTestId } = render(<Component />);
    const input = getByTestId('search-input');
    await act(async () => {
      await fireEvent.press(input);
      await fireEvent.changeText(input, '123213312');
      await fireEvent.press(input, 'submitEditing', {
        nativeEvent: { text: '123213312' }
      });
    });
    await waitFor(async () => {
      expect(await getByTestId('spinner'));
    });
    expect(getByTestId('spinner')).toBeDefined();
  });

  it('displays error message if loading accounts fails', () => {
    mockedData = {
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
      error: true
    };
    const { getByText } = render(<Component />);
    const errorMessage = getByText('Could not load accounts info');
    expect(errorMessage).toBeDefined();
  });
});
