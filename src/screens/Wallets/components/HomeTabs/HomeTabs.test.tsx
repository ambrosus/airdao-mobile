import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import { HomeTabs } from './HomeTabs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import clearAllMocks = jest.clearAllMocks;

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
    watchlist: mockedData
  })),
  useForwardedRef: jest.fn(),
  useFullscreenModalHeight: () => []
}));

jest.mock('@contexts', () => ({
  useLists: jest.fn(() => ({
    handleOnCreate: jest.fn(),
    listsOfAddressGroup: mockedListsOfAddressGroup
  }))
}));

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
        <HomeTabs />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

describe('HomeTabs', () => {
  it('renders correctly', () => {
    mockedData = [
      {
        _id: '123123',
        address: '123123123',
        ambBalance: 100,
        transactionCount: 1,
        type: 'account',
        name: 'asdasdasd'
      }
    ];
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
    const { getByTestId, getByText } = render(<Component />);
    const homeTabs = getByTestId('Home_Tabs');
    expect(getByText('Watchlist')).toBeTruthy();
    expect(getByText('Collections')).toBeTruthy();
    expect(getByText('See all')).toBeTruthy();
    expect(getByTestId('Scroll_To_Watchlist_Button')).toBeDefined();
    expect(getByTestId('Scroll_To_Collections_Button')).toBeDefined();
    expect(
      getByTestId('Add_Address_Or_Create_Collection_Button')
    ).toBeDefined();
    expect(getByTestId('Home_Watchlists')).toBeDefined();
    expect(getByTestId('Home_Collections')).toBeDefined();
    expect(getByTestId('Home_Tabs_Scroll_View')).toBeDefined();
    expect(homeTabs).toBeTruthy();
  });

  it('HomeTabs scrolls horizontally', () => {
    const { getByTestId } = render(<Component />);
    const scrollView = getByTestId('Home_Tabs_Scroll_View');
    fireEvent.scroll(scrollView, { target: { scrollLeft: 100 } });
    setTimeout(() => {
      expect(scrollView.scrollLeft).toEqual(100);
    }, 500);
  });

  it('displays the empty list of addresses when there are no addresses added', () => {
    mockedData = [];
    const { getByTestId } = render(<Component />);
    const emptyComponent = getByTestId('empty-list');
    expect(emptyComponent).toBeTruthy();
  });

  it('displays address correctly', () => {
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
    const { getByText, getByTestId } = render(<Component />);
    const watchlist = getByTestId('Home_Watchlists');
    expect(watchlist).toBeTruthy();
    expect(getByText('Test address')).toBeTruthy();
    expect(getByText('$142,024,495,783')).toBeTruthy();
    expect(getByText('1,154,670,697 AMB')).toBeTruthy();
  });

  it('should open the create new collection modal on press', async () => {
    const { getByTestId, getAllByTestId } = render(<Component />);
    const button = getByTestId('Add_Address_Or_Create_Collection_Button');
    await act(async () => {
      await fireEvent.press(button);
    });
    await waitFor(async () => {
      await expect(
        getAllByTestId('Create_Collection_Or_Add_Address_BottomSheet')
      ).toBeTruthy();
    });
  });

  it('displays the empty list of collections when there are no collection', () => {
    mockedListsOfAddressGroup = [];
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
    const { getByTestId } = render(<Component />);
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
    mockedData = [];
    const { getByTestId, getByText } = render(<Component />);
    const collections = getByTestId('Home_Collections');
    expect(collections).toBeTruthy();
    expect(getByText('Test collection')).toBeTruthy();
  });
  clearAllMocks();
});
