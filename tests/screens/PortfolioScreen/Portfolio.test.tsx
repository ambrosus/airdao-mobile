
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Watchlist } from '@screens/Settings/screens/Watchlist';
import clearAllMocks = jest.clearAllMocks;

Object.defineProperty(Array.prototype, 'indexOfItem', {
  value: jest.fn()
});

let mockedAddress = [
  {
    _id: '123123',
    address: '123123123',
    ambBalance: 100,
    transactionCount: 1,
    type: 'account',
    name: 'asdasdasd'
  }
];

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

jest.mock('@hooks', () => ({
  useRef: jest.fn(),
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
  useWatchlist: jest.fn(() => ({
    watchlist: mockedAddress
  })),
  useSwipeableDismissListener: jest.fn()
}));

jest.mock('@react-navigation/bottom-tabs', () => ({
  useBottomTabBarHeight: jest.fn()
}));

const queryClient = new QueryClient();

const PortfolioWatchlists = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <Watchlist route={{ params: { tabs: { activeTab: 0 } } }} />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

const PortfolioCollections = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <Watchlist route={{ params: { tabs: { activeTab: 1 } } }} />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

describe('Portfolio Screen', () => {
  afterAll(() => {
    clearAllMocks();
  });

  it('renders correctly', async () => {
    const { getByTestId, getAllByTestId, getByText } = render(
      <PortfolioWatchlists />
    );
    expect(getByTestId('Portfolio_Screen')).toBeTruthy();
    expect(getByText('Portfolio')).toBeTruthy();
    expect(getByTestId('Portfolio_Screen_Tabs')).toBeTruthy();
    expect(getByTestId('Portfolio_Tabs_Button')).toBeTruthy();
    expect(getAllByTestId('Portfolio_Screen_Tab_Item')).toBeTruthy();
  });

  it('displays the empty list of addresses when there are no addresses added', () => {
    mockedListsOfAddressGroup = [
      {
        id: '1223123',
        name: 'Test collection',
        accounts: [
          {
            _id: '6200de3b523162b8b87baff1',
            address: '0xF977814e90dA44bFA03b6295A0616a897441aceC',
            ambBalance: 123.123,
            transactionCount: 1,
            type: 'account',
            name: 'Test address'
          }
        ]
      }
    ];
    mockedAddress = [];
    const { getByTestId } = render(<PortfolioWatchlists />);
    const emptyComponent = getByTestId('empty-list');
    expect(emptyComponent).toBeTruthy();
  });

  it('displays adress correctly', () => {
    mockedAddress = [
      {
        _id: '6200de3b523162b8b87baff1',
        address: '0xF977814e90dA44bFA03b6295A0616a897441aceC',
        ambBalance: 1154670697.424454,
        transactionCount: 17,
        type: 'undefined',
        name: 'Test address'
      }
    ];
    const { getByText } = render(<PortfolioWatchlists />);
    expect(getByText('Watchlists')).toBeTruthy();
    expect(getByText('Test address')).toBeTruthy();
    expect(getByText('$142,024,495,783')).toBeTruthy();
    expect(getByText('1,154,670,697 AMB')).toBeTruthy();
  });

  it('should open the create new collection modal on press', async () => {
    const { getByText, getByTestId, getAllByTestId } = render(
      <PortfolioCollections />
    );
    expect(getByTestId('Portfolio_Tabs_Button')).not.toBeNull();
    await act(async () => {
      await fireEvent.press(getByText('Create collection'));
    });
    await waitFor(async () => {
      await expect(
        getAllByTestId('Create_Rename_Collection_BottomSheet')
      ).toBeTruthy();
    });
  });

  it('displays the empty list of collections when there are no collection', () => {
    mockedListsOfAddressGroup = [];
    const { getByTestId } = render(<PortfolioCollections />);
    const emptyComponent = getByTestId('empty-list');
    expect(emptyComponent).toBeTruthy();
  });

  it('displays collections when there are collections', () => {
    mockedListsOfAddressGroup = [
      {
        id: '1223123',
        name: 'Test collection',
        accounts: [
          {
            _id: '6200de3b523162b8b87baff1',
            address: '0xF977814e90dA44bFA03b6295A0616a897441aceC',
            ambBalance: 123.123,
            transactionCount: 1,
            type: 'account',
            name: 'Test address'
          }
        ]
      }
    ];
    const { getByTestId, getByText } = render(<PortfolioCollections />);
    const collections = getByTestId('lists-groups');
    expect(collections).toBeTruthy();
    expect(getByText('Test collection')).toBeTruthy();
  });
});
