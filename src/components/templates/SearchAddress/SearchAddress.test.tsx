import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SearchAddress } from '@components/templates';

jest.mock('@contexts/OnboardingContext', () => ({
  useOnboardingStatus: jest.fn(() => ({
    status: 'none',
    skip: jest.fn(),
    back: jest.fn()
  }))
}));

jest.mock('victory-native', () => {
  return {
    VictoryChart: jest.fn(),
    VictoryTheme: {},
    VictoryLine: jest.fn(),
    VictoryAxis: jest.fn()
  };
});

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

const queryClient = new QueryClient();

const Component = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <SearchAddress />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

describe('SearchAddress', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<Component />);
    expect(getByTestId('Search_Address')).toBeDefined();
    expect(getByTestId('Search_Address_Input')).toBeDefined();
    expect(getByTestId('Barcode_Scanner')).toBeDefined();
  });

  it('should clear the input on clear button press', async () => {
    const { getByTestId } = render(<Component />);
    const searchInput = getByTestId('Search_Address_Input');
    const clearButton = getByTestId('Clear_Input_Button');
    fireEvent.changeText(
      searchInput,
      '0xF977814e90dA44bFA03b6295A0616a897441aceC'
    );
    fireEvent.press(clearButton);
    await waitFor(() => expect(searchInput.props.value).toBe(undefined));
  });
});

// TODO WatchlistAddSuccess
// TODO AccountTransactions
