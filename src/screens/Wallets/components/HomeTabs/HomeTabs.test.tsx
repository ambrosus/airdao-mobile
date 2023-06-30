import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { HomeTabs } from './HomeTabs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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
});
