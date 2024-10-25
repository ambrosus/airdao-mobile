import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ExplorerAccountView } from '@components/templates';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { MockTransaction } from '../../../__mocks__/models/Transaction.mock';
import { ExplorerAccountType } from '@appTypes';
import { ExplorerAccount } from '@models';
import clearAllMocks = jest.clearAllMocks;

// const mockTransaction = MockTransaction;

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
// dayjs().fromNow = jest.fn();

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

jest.mock('@contexts/AllAddresses', () => ({
  useAllAddressesReducer: () => jest.fn(),
  useAllAddresses: jest.fn(() => {
    return [];
  })
}));

Object.defineProperty(Array.prototype, 'indexOfItem', {
  value: jest.fn()
});

const mockedAccount: ExplorerAccount = {
  _id: '6200de3b523162b8b87baff1',
  address: '0xF977814e90dA44bFA03b6295A0616a897441aceC',
  ambBalance: 1154677,
  transactionCount: 17,
  type: ExplorerAccountType.Account,
  name: 'Test Account',
  calculatePercentHoldings: () => 0
};

const mockOnToggleWatchlist = jest.fn();

const Component = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ExplorerAccountView
          onToggleWatchlist={mockOnToggleWatchlist}
          account={mockedAccount}
          nameVisible={true}
        />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

describe('ExplorerAccountView', () => {
  afterAll(() => {
    clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText, getByTestId } = render(<Component />);
    expect(getByTestId('Explorer_Account_View')).toBeDefined();
    expect(getByTestId('Copy_To_Clipboard_Button')).toBeDefined();
    expect(getByTestId('Add_To_Watchlist_Button')).toBeDefined();
    expect(getByTestId('Add_To_Collection_Button')).toBeDefined();
    expect(getByText('0xF977814e9...1aceC')).toBeDefined();
    expect(getByText('Test Account')).toBeDefined();
  });

  it.skip('should toggle watchlist when the "Add to Watchlist" button is pressed', async () => {
    const { getByTestId } = render(<Component />);
    const addToWatchlistButton = getByTestId('Add_To_Watchlist_Button');
    await waitFor(async () => {
      await fireEvent.press(addToWatchlistButton);
    });
    await expect(mockOnToggleWatchlist).toHaveBeenCalledWith(true);
    // mock permission in watchChangesOfWallet func for this test to pass
  });

  it('should show the "Add address to collection" modal when the "Add to Collection" button is pressed', async () => {
    const { getByTestId, getByText } = render(<Component />);
    const addToCollectionButton = getByTestId('Add_To_Collection_Button');
    await waitFor(async () => {
      await fireEvent.press(addToCollectionButton);
    });
    expect(getByText('Add address to collection')).toBeDefined();
  });
});
