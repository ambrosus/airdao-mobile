import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { AddressDetails } from '@screens/Address';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';
import clearAllMocks = jest.clearAllMocks;

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({
    params: { address: '0xF977814e90dA44bFA03b6295A0616a897441aceC' }
  }),
  useNavigation: jest.fn()
}));

jest.mock('@hooks/query/useExplorerInfo', () => ({
  useExplorerInfo: jest.fn(() => ({
    data: {},
    loading: false,
    error: false
  }))
}));

Object.defineProperty(Array.prototype, 'indexOfItem', {
  value: jest.fn()
});

jest.mock('@contexts/ListsContext', () => ({
  useLists: jest.fn(() => ({
    listsOfAddressGroup: [],
    createGroupRef: jest.fn()
  }))
}));

const mockedData = {
  address: '',
  enabled: false,
  data: [
    {
      _id: '6200de3b523162b8b87baff1',
      address: '0xF977814e90dA44bFA03b6295A0616a897441aceC',
      ambBalance: 1154670697.424454,
      transactionCount: 17,
      type: 'undefined',
      name: 'Address'
    }
  ],
  loading: false,
  error: false
};

jest.mock('@contexts/AllAddresses', () => ({
  useAllAddressesReducer: () => jest.fn(),
  useAllAddresses: jest.fn(() => {
    return [];
  })
}));

jest.mock('@hooks/query/useSearchAccount', () => ({
  useSearchAccount: jest.fn(() => ({
    address: mockedData.address,
    data: [mockedData],
    loading: false,
    error: false
  }))
}));

const mockRemoveFromWatchlist = jest.fn();
const mockAddToWatchlist = jest.fn();

jest.mock('@hooks/cache/useWatchlist', () => ({
  useWatchlist: jest.fn(() => ({
    removeFromWatchlist: mockRemoveFromWatchlist,
    watchlist: [
      {
        _id: '6200de3b523162b8b87baff1',
        address: '0xF977814e90dA44bFA03b6295A0616a897441aceC',
        ambBalance: 1154670697.424454,
        transactionCount: 17,
        type: 'undefined',
        name: 'Address'
      }
    ],
    addToWatchlist: mockAddToWatchlist
  }))
}));

jest.mock('@utils/string');

jest.mock('@utils/number', () => ({
  NumberUtils: {
    formatNumber: jest.fn(),
    addSignToNumber: jest.fn(),
    abbreviateNumber: jest.fn((num: number) => (num ? num.toString() : ''))
  }
}));

const queryClient = new QueryClient();

const Component = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AddressDetails />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

describe('Single Address Screen', () => {
  afterAll(() => {
    clearAllMocks();
  });

  it('renders correctly', async () => {
    const { getByTestId, getByText } = render(<Component />);
    expect(getByTestId('Address_Screen')).toBeTruthy();
    expect(getByTestId('Add_To_Watchlist_Button')).toBeTruthy();
    expect(getByTestId('Add_To_Collection_Button')).toBeTruthy();
    expect(getByTestId('Share_Button')).toBeTruthy();
    expect(getByTestId('Edit_Button')).toBeTruthy();
    expect(getByTestId('Copy_To_Clipboard_Button')).toBeTruthy();
    expect(getByText('Recent Activity')).toBeTruthy();
    expect(getByText('Address')).toBeTruthy();
  });

  it('Address can be watchlisted', async () => {
    const { getByTestId } = render(<Component />);
    const addToWatchlistButton = getByTestId('Add_To_Watchlist_Button');
    await act(async () => {
      await fireEvent.press(addToWatchlistButton);
    });
    await waitFor(async () => {
      await expect(mockAddToWatchlist).toHaveBeenCalled();
    });
  });

  it('Button can be called on toggle watchlist', async () => {
    const { getByTestId } = render(<Component />);
    const addToWatchlistButton = getByTestId('Add_To_Watchlist_Button');
    await act(async () => {
      await fireEvent.press(addToWatchlistButton);
    });
    await expect(mockAddToWatchlist).toHaveBeenCalled();
  });

  it('Address can be copied to clipboard', async () => {
    const { getByTestId } = render(<Component />);
    const copyToClipboardButton = getByTestId('Copy_To_Clipboard_Button');
    const setStringAsyncSpy = jest.spyOn(Clipboard, 'setStringAsync');
    await act(async () => {
      await fireEvent.press(copyToClipboardButton);
    });
    expect(setStringAsyncSpy).toHaveBeenCalledWith(
      '0xF977814e90dA44bFA03b6295A0616a897441aceC'
    );
  });

  it('opens the share modal when Share button is pressed', () => {
    const { getByTestId, findByTestId, getByText } = render(<Component />);
    fireEvent.press(getByTestId('Share_Button'));
    expect(findByTestId('Share_Portfolio_BottomSheet')).toBeDefined();
    expect(getByText('Share address performance')).toBeTruthy();
    expect(getByText('1154670697.424454 AMB')).toBeTruthy();
    expect(getByText('24H Change')).toBeTruthy();
    expect(getByText('2023-07-13')).toBeTruthy();
  });

  it('should open the edit wallet modal on press', () => {
    const { getByTestId } = render(<Component />);
    fireEvent.press(getByTestId('Edit_Button'));
    expect(getByTestId('Bottom_Sheet_Edit_Wallet')).toBeDefined();
  });
});
