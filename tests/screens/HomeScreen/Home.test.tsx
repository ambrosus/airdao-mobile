import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { HomeScreen } from '@screens/Wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

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
  useRef: jest.fn(),
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

let mockedListsOfAddressGroup = [
  {
    id: '1223123',
    name: '',
    accounts: [
      {
        _id: '123',
        address: '123',
        ambBalance: 23123123,
        transactionCount: 123,
        type: 'account',
        name: '1232333'
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
describe('HomeScreen', () => {
  it('renders correctly', async () => {
    mockedListsOfAddressGroup = [
      {
        id: '1223123',
        name: 'Test collection',
        accounts: [
          {
            _id: '123',
            address: '123',
            ambBalance: 23123123,
            transactionCount: 123,
            type: 'account',
            name: '1232333'
          }
        ]
      }
    ];
    const { getByTestId, getByText } = render(<Component />);
    expect(getByTestId('Home_Screen')).toBeDefined();
    expect(getByTestId('Home_Screen_Header')).toBeDefined();
    expect(getByTestId('Home_Tabs')).toBeDefined();
    expect(getByText('Watchlists')).toBeDefined();
    expect(getByText('Collections')).toBeDefined();
    expect(getByTestId('Home_Highlights')).toBeDefined();
    expect(getByTestId('Add_Address_Or_Create_Collection_Button')).toBeTruthy();
  });

  it('renders PortfolioBalance with correct props', () => {
    const { getByTestId } = render(<Component />);
    const portfolioBalance = getByTestId('Portfolio_Balance_Title');
    expect(portfolioBalance.props.children).toEqual(['$', '12,300.00']);
    const usdBalance = getByTestId('Portfolio_Balance_USDBalance');
    expect(usdBalance.props.children).toBeTruthy();
  });

  it('add address or create collection should be callable', async () => {
    const { getByTestId, findByTestId } = render(<Component />);
    const addAddressOrCreateCollectionButton = getByTestId(
      'Add_Address_Or_Create_Collection_Button'
    );
    const addAddressOrCreateCollectionModal = getByTestId(
      'Add_Address_Or_Create_Collection_Modal'
    );
    expect(addAddressOrCreateCollectionButton).toBeTruthy();
    await act(async () => {
      await fireEvent.press(addAddressOrCreateCollectionButton);
    });
    await waitFor(async () => {
      await expect(addAddressOrCreateCollectionModal).toBeTruthy();
    });
    expect(findByTestId('Add_Address')).toBeTruthy();
    expect(findByTestId('Create_Collection')).toBeTruthy();
  });

  it('WatchLists section on home tabs should be empty when there are any addresses watchlisted', async () => {
    mockedData = [];
    const { getByTestId, getByText } = render(<Component />);
    const emptyWatchlist = getByTestId('Empty_Item');
    expect(emptyWatchlist).toBeDefined();
    expect(getByText('No addresses yet')).toBeTruthy();
  });

  it('WatchList section renders correctly with 2 addresses', async () => {
    mockedData = [
      {
        _id: '6458c9e7d186ad9c72cb6b0d',
        address: '0x8581063D09c0E885E199C14D41c3120cDD0BC521',
        ambBalance: 14672649999454,
        transactionCount: 1,
        type: 'account',
        name: ''
      },
      {
        _id: '6458d664d186ad9c72f37784',
        address: '0x38d9Dc2644ECf471dceC6d3041E48CF321fF99CC',
        ambBalance: 1000000000000,
        transactionCount: 1,
        type: 'account',
        name: ''
      }
    ];
    const { getAllByTestId, getByText } = render(<Component />);
    const firstWatchlistedAddress = getAllByTestId('WalletItem_0');
    const secondWatchlistedAddress = getAllByTestId('WalletItem_1');
    expect(firstWatchlistedAddress).toBeDefined();
    expect(secondWatchlistedAddress).toBeDefined();
    expect(getByText('0x8581...D0BC521')).toBeTruthy();
    expect(getByText('14,672,649,999,454 AMB')).toBeTruthy();
    expect(getByText('0x38d9...1fF99CC')).toBeTruthy();
    expect(getByText('1,000,000,000,000 AMB')).toBeTruthy();
  });

  it('renders Collections section with at least 1 collection', async () => {
    mockedListsOfAddressGroup = [
      {
        id: '',
        name: 'Test collection',
        accounts: [
          {
            _id: '6458c9e7d186ad9c72cb6b0d',
            address: '0x8581063D09c0E885E199C14D41c3120cDD0BC521',
            ambBalance: 146726499994540000000000000,
            transactionCount: 1,
            type: 'account',
            name: ''
          },
          {
            _id: '644fd3e50b590febc5d6bda1',
            address: '0x8687424E13b437834b6D6203e9A0f1EE084F9c25',
            ambBalance: 230613231000000000000000000,
            transactionCount: 1,
            type: 'account',
            name: ''
          }
        ]
      }
    ];
    const { getByText, getByTestId } = render(<Component />);
    await act(async () => {
      await fireEvent.press(getByText('Collections'));
    });
    const testCollection = getByText('Test collection');
    expect(testCollection).not.toBeNull();
    expect(getByTestId('percent-change-text')).toBeTruthy();
    expect(getByText('123.00%')).toBeTruthy();
    expect(getByText('undefined addresses')).toBeTruthy();
  });

  it('empty component should be rendered when there are no collections in collections list', async () => {
    mockedListsOfAddressGroup = [];
    const { getByTestId, getByText } = render(<Component />);
    await act(async () => {
      await fireEvent.press(getByText('Collections'));
    });
    await waitFor(async () => {
      await expect(getByText('No collections yet')).toBeTruthy();
    });
    const emptyCollections = getByTestId('Empty_Item');
    expect(emptyCollections).toBeDefined();
  });
});

// TODO fix test with 'handleOnCreateCollectionOrAddAddress'
