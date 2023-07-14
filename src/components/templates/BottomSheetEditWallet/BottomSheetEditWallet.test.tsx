import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BottomSheetEditWallet } from '@components/templates/BottomSheetEditWallet/index';
import React from 'react';
import { render } from '@testing-library/react-native';
import { ExplorerAccountType } from '@appTypes';
import { ExplorerAccount } from '@models';
import clearAllMocks = jest.clearAllMocks;

const queryClient = new QueryClient();

jest.mock('react-native-modal', () => {
  return ({ children }: { children: React.ReactNode }) => <>{children}</>;
});

jest.mock('@contexts/AllAddresses', () => ({
  useAllAddressesReducer: () => jest.fn(),
  useAllAddresses: jest.fn(() => {
    return [];
  })
}));

let mockedListsOfAddressGroup = [
  {
    id: '1223123',
    name: '333',
    accounts: [
      {
        _id: '6200de3b523162b8b87baff1',
        address: '0xF977814e90dA44bFA03b6295A0616a897441aceC',
        ambBalance: 1154670697.424454,
        transactionCount: 17,
        type: ExplorerAccountType.Account,
        name: '',
        calculatePercentHoldings: () => 0
      }
    ]
  }
];

const mockedWallet: ExplorerAccount = {
  _id: '6200de3b523162b8b87baff1',
  address: '0xF977814e90dA44bFA03b6295A0616a897441aceC',
  ambBalance: 1154670697.424454,
  transactionCount: 17,
  type: ExplorerAccountType.Account,
  name: '',
  calculatePercentHoldings: () => 0
};

jest.mock('@contexts/ListsContext', () => ({
  useLists: jest.fn(() => ({
    listsOfAddressGroup: mockedListsOfAddressGroup,
    createGroupRef: jest.fn()
  }))
}));

jest.mock('@contexts/OnBoardingContext', () => ({
  useOnboardingStatus: jest.fn(() => ({
    status: 'none',
    back: jest.fn(),
    skip: jest.fn()
  }))
}));

Object.defineProperty(Array.prototype, 'indexOfItem', {
  value: jest.fn()
});

jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios'
}));

const Component = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <BottomSheetEditWallet wallet={mockedWallet} />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

describe('BottomSheetEditWallet', () => {
  afterAll(() => {
    clearAllMocks();
  });

  it('renders correctly when address is in group', () => {
    mockedListsOfAddressGroup = [
      {
        id: '1223123',
        name: '333',
        accounts: [
          {
            _id: '6200de3b523162b8b87baff1',
            address: '0xF977814e90dA44bFA03b6295A0616a897441aceC',
            ambBalance: 1154670697.424454,
            transactionCount: 17,
            type: ExplorerAccountType.Account,
            name: '',
            calculatePercentHoldings: () => 0
          }
        ]
      }
    ];
    const { getByTestId, getByText, getAllByText } = render(<Component />);
    expect(getByTestId('Bottom_Sheet_Edit_Wallet')).toBeDefined();
    expect(getByText('Rename Address')).toBeTruthy();
    expect(getAllByText('Move to another collection')).toBeTruthy();
    expect(getByText('Remove from collection')).toBeTruthy();
    expect(getByText('Save')).toBeTruthy();
    expect(getByText('Cancel')).toBeTruthy();
  });

  it('renders correctly when address is not in group', () => {
    mockedListsOfAddressGroup = [];
    const { getByTestId, getByText, getAllByText } = render(<Component />);
    expect(getByTestId('Bottom_Sheet_Edit_Wallet')).toBeDefined();
    expect(getByText('Rename Address')).toBeTruthy();
    expect(getAllByText('Add to collection')).toBeTruthy();
  });
});
