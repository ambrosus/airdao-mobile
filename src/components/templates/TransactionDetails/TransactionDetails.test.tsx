import { render } from '@testing-library/react-native';
import { ExplorerAccountType, TransactionType } from '@appTypes';
import { TransactionDetails } from '@components/templates';
import { Transaction } from '@models';
import clearAllMocks = jest.clearAllMocks;

jest.mock('@hooks', () => ({
  useAMBPrice: () => ({ data: { priceUSD: 1 } }),
  useFullscreenModalHeight: () => []
}));

jest.mock('react-native-view-shot', () => ({
  captureRef: jest.fn()
}));

jest.mock('@utils/share', () => ({
  shareImage: jest.fn(),
  socialShareImage: jest.fn()
}));

const transaction: Transaction = {
  type: TransactionType.Transfer,
  amount: 100,
  from: {
    name: '',
    _id: '123456',
    ambBalance: 0,
    transactionCount: 0,
    type: ExplorerAccountType.Account,
    address: '0x1234567890abcdef',
    calculatePercentHoldings: () => 0
  },
  to: {
    name: '',
    _id: 'abcdef',
    ambBalance: 0,
    transactionCount: 0,
    type: ExplorerAccountType.Account,
    address: '0xabcdef1234567890',
    calculatePercentHoldings: () => 0
  },
  fee: 0.01,
  timestamp: new Date(),
  _id: '1234567',
  hash: 'dfghj'
};

describe('TransactionDetails', () => {
  afterAll(() => {
    clearAllMocks();
  });

  beforeAll(() => {
    clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(
      <TransactionDetails transaction={transaction} />
    );
    expect(getByText('100 AMB ($100)')).toBeTruthy();
    expect(getByText('0x12...bcdef')).toBeTruthy();
    expect(getByText('0xab...67890')).toBeTruthy();
    expect(getByText('0.01')).toBeTruthy();
  });

  it('renders without throwing an error when transaction is empty', () => {
    const emptyTransaction = {
      type: TransactionType.Transfer,
      amount: 0,
      from: {
        name: '',
        _id: '',
        ambBalance: 0,
        transactionCount: 0,
        type: ExplorerAccountType.Account,
        address: '',
        calculatePercentHoldings: () => 0
      },
      to: {
        name: '',
        _id: '',
        ambBalance: 0,
        transactionCount: 0,
        type: ExplorerAccountType.Account,
        address: '',
        calculatePercentHoldings: () => 0
      },
      fee: 0,
      timestamp: new Date(),
      _id: '',
      hash: ''
    };
    expect(() =>
      render(<TransactionDetails transaction={emptyTransaction} />)
    ).not.toThrow();
  });
});
