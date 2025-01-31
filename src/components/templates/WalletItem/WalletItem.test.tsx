import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ExplorerAccountType } from '@appTypes';
import { WalletItem } from '@components/templates';
import clearAllMocks = jest.clearAllMocks;

const mockItem = {
  _id: '1',
  name: 'Test Wallet',
  address: '0x1234',
  ambBalance: 100,
  transactionCount: 10,
  type: ExplorerAccountType.Account,
  calculatePercentHoldings: () => 0.1
};

jest.mock('@contexts/ListsContext', () => ({
  useLists: jest.fn(() => ({
    listsOfAddressGroup: [],
    createGroupRef: jest.fn(),
    toggleAddressesInList: jest.fn()
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
        <WalletItem item={mockItem} />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

describe('WalletItem', () => {
  beforeEach(() => {
    clearAllMocks();
  });

  afterAll(() => {
    clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByTestId } = render(<Component />);
    expect(getByTestId('Wallet_Item_View')).toBeTruthy();
    expect(getByTestId('Wallet_Item_Balance').props.children.join('')).toBe(
      '$0'
    );
    expect(getByTestId('Wallet_Item_AMB').props.children.join('')).toBe(
      '100 AMB'
    );
    expect(getByTestId('Wallet_Item_Name').props.children).toBe(
      'Test WalletSelectorItem'
    );
  });

  it.skip('renders address indicator when indicatorVisible is true', async () => {
    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <WalletItem item={mockItem} indicatorVisible={true} />
      </QueryClientProvider>
    );
    await expect(getByTestId('Wallet_Item_Address_Indicator')).toBeDefined();
  });

  it('does not render address indicator when indicatorVisible is false', () => {
    const { queryByTestId } = render(<Component />);
    expect(queryByTestId('Wallet_Item_Address_Indicator')).toBeNull();
  });
});
