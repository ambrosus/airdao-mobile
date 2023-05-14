import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AddWalletToList } from '@components/templates';
import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { CheckBox } from '@components/composite';
import { ExplorerAccountType } from '@appTypes';

jest.mock('victory-native', () => {
  return {
    VictoryChart: jest.fn(),
    VictoryTheme: {},
    VictoryLine: jest.fn(),
    VictoryAxis: jest.fn()
  };
});

Object.defineProperty(Array.prototype, 'indexOfItem', {
  value: jest.fn()
});

const onPressList = jest.fn();
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
    name: 'List 1',
    accounts: [
      {
        _id: 'account-id',
        address: 'wallet-address',
        ambBalance: 0,
        transactionCount: 0,
        type: ExplorerAccountType.Account,
        name: '',
        calculatePercentHoldings: () => 0
      }
    ],
    accountCount: 1,
    totalBalance: 0
  },
  {
    id: 'list-2',
    name: 'List 2',
    accounts: [],
    accountCount: 0,
    totalBalance: 0
  }
];

const queryClient = new QueryClient();

const Component = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AddWalletToList
          lists={lists}
          onPressList={onPressList}
          wallet={wallet}
        />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

describe('AddWalletToList', () => {
  it('renders correctly', async () => {
    const { getAllByTestId } = render(<Component />);
    const addWalletToList = getAllByTestId('AddWalletToList_Container')[0];
    expect(addWalletToList).toBeDefined();
  });

  it('calls onPressList when a list is pressed', () => {
    const { getByText } = render(<Component />);
    fireEvent.press(getByText('List 1'));
    expect(onPressList).toHaveBeenCalledWith(lists[0]);
  });

  it('displays the correct number of addresses in each list', () => {
    const { getAllByText } = render(<Component />);
    expect(parseInt(getAllByText(/Addresses/)[0].props.children[0], 10)).toBe(
      1
    );
    expect(parseInt(getAllByText(/Addresses/)[1].props.children[0], 10)).toBe(
      0
    );
  });

  it('displays a checkbox next to each list', () => {
    const tree = render(<Component />);
    const checkBoxComponents = tree.root.findAllByType(CheckBox);
    expect(checkBoxComponents).toHaveLength(2);
  });
});
