import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react';
import { render } from '@testing-library/react-native';
import { BottomSheetRemoveAddressFromWatchlists } from '@components/templates/BottomSheetConfirmRemove/BottomSheetRemoveAddressFromWatchlists';
import { ExplorerAccountType } from '@appTypes';
import clearAllMocks = jest.clearAllMocks;

const mockItem = {
  _id: '1',
  name: 'Test Wallet',
  address: '0x1234',
  ambBalance: 100,
  transactionCount: 10,
  type: ExplorerAccountType.Account,
  calculatePercentHoldings: () => 0.1
};

jest.mock('@contexts/AllAddresses', () => ({
  useAllAddressesReducer: () => jest.fn(),
  useAllAddresses: jest.fn(() => {
    return [];
  })
}));

const queryClient = new QueryClient();

const Component = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <BottomSheetRemoveAddressFromWatchlists item={mockItem} />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

describe('BottomSheetRemoveAddressFromWatchlists', () => {
  afterAll(() => {
    clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByTestId, findByTestId, findByText } = render(<Component />);
    expect(
      getByTestId('BottomSheet_Remove_Address_From_Watchlists')
    ).toBeDefined();
    expect(findByTestId('BottomSheet_Content')).toBeTruthy();
    expect(findByTestId('BottomSheetConfirmRemove_Button')).toBeTruthy();
    expect(findByTestId('Cancel_Button')).toBeTruthy();
    expect(findByText('Remove this address from watchlist?')).toBeTruthy();
  });
});
