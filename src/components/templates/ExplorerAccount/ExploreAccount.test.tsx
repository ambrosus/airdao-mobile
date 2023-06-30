import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import {
  ExplorerAccountTransactionItem,
  ExplorerAccountView
} from '@components/templates';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { MockTransaction } from '@__mocks__/models/Transaction.mock';

const mockTransaction = MockTransaction;

// dayjs.extend(relativeTime);
// const fromNowMock = jest
//   .spyOn(dayjs.fn, 'fromNow')
//   .mockImplementation(() => 'mocked fromNow result');

// jest.mock('dayjs/plugin/customParseFormat', () => ({
//   default: jest.requireActual('dayjs/plugin/customParseFormat')
// }));
// jest.mock('dayjs/plugin/fromNow', () => ({
//   default: jest.requireActual('dayjs/plugin/fromNow')
// }));
// const mock = jest.genMockFromModule('dayjs');
//
// const dayjs = jest.requireActual('dayjs');
// const utc = jest.requireActual('dayjs/plugin/utc');
// dayjs.extend(utc);
//
// mock.utc = jest
//   .fn()
//   .mockReturnValue(dayjs.utc(new Date('1995-12-17T03:24:00')));
//
// mock.utc = jest
//   .fn()
//   .mockReturnValue(dayjs.utc(new Date('1995-12-17T03:24:00')));
// // jest.mock('dayjs', () => ({
//   fromNow: jest.fn()
// }));
// dayjs().fromNow = jest.fn();

// jest.mock(
//   'dayjs',
//   jest.fn(() => ({
//     fromNow: jest.fn
//   }))
// );
dayjs().fromNow = jest.fn();

const queryClient = new QueryClient();

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

Object.defineProperty(Array.prototype, 'indexOfItem', {
  value: jest.fn()
});

const mockedAccount = {
  ambBalance: 100,
  address: '0xF977814e90dA44bFA03b6295A0616a897441aceC',
  name: 'Test Account',
  isOnWatchlist: true
};
const mockedTotalSupply = 1000;

const Component = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ExplorerAccountView
          account={mockedAccount}
          totalSupply={mockedTotalSupply}
          nameVisible={true}
        />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

describe('ExplorerAccountTransactionItem', () => {
  afterAll(() => {
    fromNowMock.mockRestore();
  });
  it('renders the component', () => {
    const { getByText } = render(
      <ExplorerAccountTransactionItem transaction={mockTransaction} />
    );
    expect(getByText('Transaction Details')).toBeTruthy();
  });

  it('displays the transaction details when the button is pressed', () => {
    const { getByText, getByTestId } = render(
      <ExplorerAccountTransactionItem transaction={mockTransaction} />
    );
    const button = getByTestId('Transaction_Button');
    fireEvent.press(button);
    expect(getByText('Transaction Details')).toBeTruthy();
  });

  it('disables the button when the disabled prop is true', () => {
    const { getByTestId } = render(
      <ExplorerAccountTransactionItem transaction={mockTransaction} disabled />
    );
    const button = getByTestId('Transaction_Button');
    expect(button.props.disabled).toBe(true);
  });

  it('renders with mocked props correctly', () => {
    const { getByText, getByTestId } = render(<Component />);
    const copyToClipboardButton = getByTestId('CopyToClipboardButton');
    expect(getByText('0xF977814e90...1aceC')).toBeTruthy();
    expect(getByText('Test Account')).toBeTruthy();
    expect(getByText('100.00 AMB')).toBeTruthy();
    expect(getByText('Holding 10.00% Supply')).toBeTruthy();
    expect(copyToClipboardButton).toBeDefined();
  });
});
