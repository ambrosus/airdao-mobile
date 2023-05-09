import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
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
        _id: 'qdsdasasaf',
        address: 'assaasfqfffewf',
        ambBalance: 123,
        transactionCount: 231,
        type: 'account',
        name: 'klskjalsfjlklaskf'
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

  // it('displays loading spinner while loading accounts', async () => {
  //   const { getByTestId } = render(<Component />);
  //   const input = getByTestId('search-input');
  //   await act(async () => {
  //     await fireEvent.press(input);
  //     await fireEvent.changeText(input, '123213312');
  //   });
  //   await waitFor(async () => {
  //     const spinner = await getByTestId('spinner');
  //   });
  // });
  //
  // it('displays error message if loading accounts fails', () => {
  //   const mockedData = {
  //     error: true,
  //     loading: false,
  //     data: undefined
  //   };
  //   jest.mock('@hooks/query', () => ({
  //     useExplorerAccounts: jest.fn(() => mockedData),
  //     useExplorerInfo: jest.fn(() => undefined)
  //   }));
  //   const { getByText } = render(<Component />);
  //   const errorMessage = getByText('Could not load accounts info');
  //   expect(errorMessage).toBeDefined();
  // });
});
