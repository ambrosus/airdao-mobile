import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AddWalletToList } from '@components/templates';
import React from 'react';
import { render } from '@testing-library/react-native';
import { ExplorerAccountType } from '@appTypes';
import clearAllMocks = jest.clearAllMocks;

Object.defineProperty(Array.prototype, 'indexOfItem', {
  value: jest.fn()
});

const wallet = {
  _id: 'wallet-id',
  address: 'wallet-address',
  ambBalance: 0,
  transactionCount: 0,
  type: ExplorerAccountType.Account,
  name: '',
  calculatePercentHoldings: () => 0
};
const lists = [
  {
    id: 'list-1',
    name: 'Test collection 1',
    accounts: [
      {
        _id: '6200de3b523162b8b87baff1',
        address: '0xF977814e90dA44bFA03b6295A0616a897441aceC',
        ambBalance: 123.123,
        transactionCount: 1,
        type: ExplorerAccountType.Account,
        name: 'Test address',
        calculatePercentHoldings: () => 0
      }
    ],
    accountCount: 1,
    totalBalance: 0
  },
  {
    id: 'list-2',
    name: 'Test collection 2',
    accounts: [],
    accountCount: 0,
    totalBalance: 0
  }
];

jest.mock('@contexts/ListsContext', () => ({
  useLists: jest.fn(() => ({
    listsOfAddressGroup: [],
    createGroupRef: jest.fn(),
    toggleAddressesInList: jest.fn()
  }))
}));

const queryClient = new QueryClient();

const Component = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AddWalletToList lists={lists} wallet={wallet} />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

describe('AddWalletToList', () => {
  afterAll(() => {
    clearAllMocks();
  });

  it('renders correctly', async () => {
    const { getAllByTestId, getAllByText, getByText } = render(<Component />);
    const addWalletToList = getAllByTestId('AddWalletToList_Container')[0];
    expect(addWalletToList).toBeDefined();
    expect(getByText('Test collection 1')).toBeTruthy();
    expect(getByText('Test collection 2')).toBeTruthy();
    expect(parseInt(getAllByText(/Addresses/)[0].props.children[0], 10)).toBe(
      1
    );
    expect(parseInt(getAllByText(/Addresses/)[1].props.children[0], 10)).toBe(
      0
    );
  });
});
