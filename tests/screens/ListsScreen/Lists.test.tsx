import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ListsScreen } from '@screens/Lists';
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
  }))
}));

const queryClient = new QueryClient();

const Component = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ListsScreen />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

describe('ListsScreen', () => {
  it('renders without crashing', async () => {
    const { getByTestId } = render(<Component />);
    expect(getByTestId('lists-screen')).toBeTruthy();
  });

  it('should open the create new list modal on press', async () => {
    const { getByText, getByTestId } = render(<Component />);
    fireEvent.press(getByText('Create new list'));
    expect(getByTestId('float-button')).not.toBeNull();
  });

  it('displays the "EmptyListsOfGroups" component when there are no lists of address groups', () => {
    mockedListsOfAddressGroup = [];
    const { getAllByTestId } = render(<Component />);
    const emptyComponent = getAllByTestId('empty-lists-of-groups');
    expect(emptyComponent).toBeTruthy();
  });

  it('displays the "ListsGroups" component when there are lists of address groups', () => {
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
    const { getAllByTestId } = render(<Component />);
    const groupsComponent = getAllByTestId('lists-groups');
    expect(groupsComponent).toBeTruthy();
  });
});
