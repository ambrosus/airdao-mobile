
import { act, fireEvent, render } from '@testing-library/react-native';
import { HomeScreen } from '@screens/Wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import clearAllMocks = jest.clearAllMocks;

jest.mock('react-native-graph', () => ({
  LineGraph: jest.fn(),
  GraphPoint: jest.fn()
}));

let mockedData = [
  {
    _id: '123123',
    address: '123123123',
    ambBalance: 100,
    transactionCount: 1,
    type: 'account',
    name: 'Watchlisted Address'
  }
];

let mockedNotificationsData = [{}];

jest.mock('@hooks', () => ({
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
  usePersonalList: jest.fn(() => ({
    personalList: mockedData
  })),
  useWatchlist: jest.fn(() => ({
    watchlist: mockedData
  })),
  useNotificationsQuery: jest.fn(() => ({
    data: mockedNotificationsData
  })),
  useInitialMountEffect: jest.fn((fn, when) => {
    if (when) {
      fn();
    }
  }),
  useAMBPriceHistorical: jest.fn(() => ({
    data: []
  }))
}));

jest.mock('@contexts/AllAddresses', () => ({
  useAllAddresses: jest.fn(() => {
    return [];
  }),
  useAllAddressesReducer: jest.fn()
}));

jest.mock('@shopify/react-native-skia', () => ({
  runSpring: jest.fn(),
  useValue: jest.fn(),
  Circle: jest.fn(),
  Group: jest.fn()
}));

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

jest.mock('@contexts', () => ({
  useLists: jest.fn(() => ({
    handleOnCreate: jest.fn(),
    listsOfAddressGroup: mockedListsOfAddressGroup
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
describe('Home Screen', () => {
  afterAll(() => {
    clearAllMocks();
  });

  it('renders correctly', async () => {
    mockedNotificationsData = [];
    const { getByTestId, getByText } = render(<Component />);
    expect(getByTestId('Home_Screen')).toBeDefined();
    expect(getByTestId('Header_ContentRight')).toBeDefined();
    expect(getByText('Watchlisted Address')).toBeDefined();
    expect(getByText('Watchlist')).toBeDefined();
    expect(getByTestId('Portfolio_Balance')).toBeDefined();
    expect(getByTestId('Home_Tabs')).toBeDefined();
    expect(getByTestId('Scroll_To_Watchlist_Button')).toBeDefined();
    expect(getByTestId('Scroll_To_Collections_Button')).toBeDefined();
  });

  it('WatchList Tab should be empty when there are no addresses inside', async () => {
    mockedData = [];
    const { getAllByTestId } = render(<Component />);
    expect(getAllByTestId('empty-list')).toBeDefined();
  });

  it('WatchList Tab should have a mocked address inside', async () => {
    mockedData = [
      {
        _id: '123123',
        address: '123123123',
        ambBalance: 100,
        transactionCount: 1,
        type: 'account',
        name: 'Mocked Address'
      }
    ];
    const { getByText } = render(<Component />);
    expect(getByText('Mocked Address')).toBeDefined();
    expect(getByText('$12,300')).toBeDefined();
  });

  it('displays the empty list of addresses when there are no addresses added', () => {
    mockedData = [];
    mockedListsOfAddressGroup = [
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
    const { getByTestId } = render(<Component />);
    const emptyComponent = getByTestId('empty-list');
    expect(emptyComponent).toBeTruthy();
  });

  it('displays adress correctly', () => {
    mockedData = [
      {
        _id: '6200de3b523162b8b87baff1',
        address: '0xF977814e90dA44bFA03b6295A0616a897441aceC',
        ambBalance: 1154670697.424454,
        transactionCount: 17,
        type: 'undefined',
        name: 'Test address'
      }
    ];
    const { getByText } = render(<Component />);
    expect(getByText('Watchlist')).toBeTruthy();
    expect(getByText('Test address')).toBeTruthy();
    expect(getByText('$142,024,495,783')).toBeTruthy();
    expect(getByText('1,154,670,697 AMB')).toBeTruthy();
  });

  it('displays the empty list of collections when there are no collection', async () => {
    mockedData = [
      {
        _id: '6200de3b523162b8b87baff1',
        address: '0xF977814e90dA44bFA03b6295A0616a897441aceC',
        ambBalance: 1154670697.424454,
        transactionCount: 17,
        type: 'undefined',
        name: 'Test address'
      }
    ];
    mockedListsOfAddressGroup = [];
    const { getByTestId, getByText } = render(<Component />);
    const collectionsTab = getByTestId('Scroll_To_Collections_Button');
    await act(async () => {
      await fireEvent.press(collectionsTab);
    });
    expect(getByText('Collections')).toBeTruthy();
    const emptyComponent = getByTestId('empty-list');
    expect(emptyComponent).toBeTruthy();
  });
});

// TODO test for notifications and scanner buttons
// TODO test that Watchlists_Button and Collections_Button are pressable and calls correct bottom sheets on the screen
