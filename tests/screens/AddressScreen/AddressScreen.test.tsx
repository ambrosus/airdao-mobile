import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { AddressDetails } from '@screens/Address';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('victory-native', () => {
  return {
    VictoryChart: jest.fn(),
    VictoryTheme: {},
    VictoryLine: jest.fn(),
    VictoryAxis: jest.fn()
  };
});
jest.mock('@contexts/OnBoardingUserContext', () => ({
  useOnboardingStatus: jest.fn(() => ({
    status: 'none',
    handleStepChange: jest.fn()
  }))
}));

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({
    params: { address: '' }
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

const mockedListsOfAddressGroup = [
  {
    id: '1223123',
    name: '333',
    accounts: [
      {
        _id: '123',
        address: '123',
        ambBalance: 23123123,
        transactionCount: 123,
        type: 'account',
        name: '1232333'
      },
      {
        _id: '6200de3b523162b8b87baff1',
        address: '0xF977814e90dA44bFA03b6295A0616a897441aceC',
        ambBalance: 1154670697.424454,
        transactionCount: 17,
        type: 'undefined',
        name: ''
      }
    ]
  }
];

Object.defineProperty(Array.prototype, 'indexOfItem', {
  value: jest.fn()
});

jest.mock('@contexts/ListsContext', () => ({
  useLists: jest.fn(() => ({
    listsOfAddressGroup: mockedListsOfAddressGroup,
    createGroupRef: jest.fn()
  }))
}));

let mockedData = {
  address: '',
  enabled: false,
  data: [
    {
      _id: '6200de3b523162b8b87baff1',
      address: '0xF977814e90dA44bFA03b6295A0616a897441aceC',
      ambBalance: 1154670697.424454,
      transactionCount: 17,
      type: 'undefined',
      name: ''
    }
  ],
  loading: false,
  error: false
};

jest.mock('@contexts/OnBoardingUserContext', () => ({
  useOnboardingStatus: jest.fn(() => ({
    status: 'none'
  }))
}));

jest.mock('@contexts/AllAddresses', () => ({
  useAllAddressesReducer: () => jest.fn(),
  useAllAddresses: jest.fn(() => {
    return [];
  })
}));
jest.mock('@hooks/query/useSearchAccount', () => ({
  useSearchAccount: jest.fn(() => mockedData)
}));

const mockRemoveFromWatchlist = jest.fn();

jest.mock('@hooks/cache/useWatchlist', () => ({
  useWatchlist: jest.fn(() => ({
    removeFromWatchlist: mockRemoveFromWatchlist,
    watchlist: [
      {
        _id: '123123',
        address: '123123123',
        ambBalance: 100,
        transactionCount: 1,
        type: 'account',
        name: 'asdasdasd'
      }
    ],
    addToWatchlist: mockRemoveFromWatchlist
  }))
}));

jest.mock('@utils/string');

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

describe('AddressDetails', () => {
  it('toaster should be visible', async () => {
    const { getByTestId } = render(<Component />);
    const button = getByTestId('watchlist-button');
    await act(async () => {
      await fireEvent.press(button);
    });
    await waitFor(async () => {
      await expect(mockRemoveFromWatchlist).toHaveBeenCalled();
    });
  });
  it('should open the edit wallet modal on press', async () => {
    const { getByTestId } = render(<Component />);
    const editWalletModal = getByTestId('BottomSheetEditWallet');
    act(() => {
      fireEvent.press(editWalletModal);
    });
    expect(getByTestId('BottomSheetEditWallet')).toBeDefined();
  });

  it('renders correctly', async () => {
    const { getByTestId } = render(<Component />);
    expect(getByTestId('address-screen')).toBeTruthy();
  });

  it('should render loading spinner when account and explorer info are loading', () => {
    mockedData = {
      address: '',
      enabled: false,
      data: [
        {
          _id: '6200de3b523162b8b87baff1',
          address: '0xF977814e90dA44bFA03b6295A0616a897441aceC',
          ambBalance: 1154670697.424454,
          transactionCount: 17,
          type: 'undefined',
          name: ''
        }
      ],
      loading: true,
      error: false
    };
    const { getByTestId } = render(<Component />);
    expect(getByTestId('loading-spinner')).toBeDefined();
  });

  it('should render error message when there is an account error', () => {
    mockedData = {
      address: '',
      enabled: false,
      data: [
        {
          _id: '6200de3b523162b8b87baff1',
          address: '0xF977814e90dA44bFA03b6295A0616a897441aceC',
          ambBalance: 1154670697.424454,
          transactionCount: 17,
          type: 'undefined',
          name: ''
        }
      ],
      loading: false,
      error: true
    };
    const { getByText } = render(<Component />);
    expect(getByText('Error Occurred')).toBeDefined();
  });
});
