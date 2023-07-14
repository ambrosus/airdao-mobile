import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import { SearchScreen } from '@screens/Search';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ExplorerAccountType } from '@appTypes';
import clearAllMocks = jest.clearAllMocks;

Object.defineProperty(Array.prototype, 'indexOfItem', {
  value: jest.fn()
});

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

const mockedListsOfAddressGroup = [
  {
    id: '1223123',
    name: '333',
    accounts: [
      {
        _id: '6200de3b523162b8b87baff1',
        address: '0xF977814e90dA44bFA03b6295A0616a897441aceC',
        ambBalance: 1154670697.424454,
        transactionCount: 17,
        type: ExplorerAccountType.Account,
        name: '',
        calculatePercentHoldings: () => 0
      }
    ]
  }
];

jest.mock('@contexts/ListsContext', () => ({
  useLists: jest.fn(() => ({
    listsOfAddressGroup: mockedListsOfAddressGroup,
    createGroupRef: jest.fn()
  }))
}));

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
        <SearchScreen />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};
describe('SearchScreen', () => {
  afterAll(() => {
    clearAllMocks();
  });

  it('renders correctly', async () => {
    const { getByTestId, getByText } = render(<Component />);
    const barcodeScanner = getByTestId('Barcode_Scanner');
    const listOfAddresses = getByTestId('List_Of_Addresses');
    expect(getByTestId('Search_Screen')).toBeTruthy();
    expect(getByText('Top holders')).toBeTruthy();
    expect(barcodeScanner).toBeDefined();
    expect(listOfAddresses).not.toBeNull();
    expect(getByTestId('search-input')).not.toBeNull();
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
