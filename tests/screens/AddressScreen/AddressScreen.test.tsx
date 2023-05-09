import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { AddressDetails } from '@screens/Address';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAllAddresses } from '@contexts';

// jest.spyOn(ArrayD, 'indexOfItem').mockImplementation(() => ({
//   indexOfItem: jest.fn(() => 5)
// }));
// jest.mock('../../../index.d.ts', () => ({
//   indexOfItem: jest.fn(() => 123)
// }));
jest.mock('victory-native', () => {
  return {
    VictoryChart: jest.fn(),
    VictoryTheme: {},
    VictoryLine: jest.fn(),
    VictoryAxis: jest.fn()
  };
});

jest.mock('@contexts', () => ({
  useOnboardingStatus: jest.fn(() => ({
    status: 'none',
    handleStepChange: jest.fn()
  })),
  useAllAddresses: jest.fn(() => {
    return [];
  }),
  useAllAddressesReducer: jest.fn()
}));
jest.mock('@contexts/OnBoardingUserContext', () => ({
  useOnboardingStatus: jest.fn(() => ({
    status: 'none',
    handleStepChange: jest.fn()
  }))
}));

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({
    params: { address: '' }
  }),
  useNavigation: jest.fn()
}));

jest.mock('@hooks/query/useExplorerInfo', () => ({
  useExplorerInfo: jest.fn(() => ({
    data: {},
    loading: false,
    error: false
  }))
}));

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
      },
      {
        _id: '6200de3b523162b8b87baff1',
        address: '0xF977814e90dA44bFA03b6295A0616a897441aceC',
        ambBalance: 1154670697.424454,
        transactionCount: 17,
        type: 'undefined',
        name: ''
      }
    ]
  }
];
Object.defineProperty(Array.prototype, 'indexOfItem', {
  value: jest.fn()
});
jest.mock('@contexts/ListsContext', () => ({
  useLists: jest.fn(() => ({
    listsOfAddressGroup: mockedListsOfAddressGroup,
    createGroupRef: jest.fn()
  }))
}));

let mockedData = {
  address: '',
  enabled: false,
  data: [
    {
      _id: '6200de3b523162b8b87baff1',
      address: '0xF977814e90dA44bFA03b6295A0616a897441aceC',
      ambBalance: 1154670697.424454,
      transactionCount: 17,
      type: 'undefined',
      name: ''
    }
  ],
  loading: false,
  error: false
};

jest.mock('@hooks/query/useSearchAccount', () => ({
  useSearchAccount: jest.fn(() => mockedData)
}));

jest.mock('@hooks/cache/usePersonalList', () => ({
  usePersonalList: jest.fn(() => ({
    personalList: [
      {
        _id: '6200de3b523162b8b87baff1',
        address: '0xF977814e90dA44bFA03b6295A0616a897441aceC',
        ambBalance: 1154670697.424454,
        transactionCount: 17,
        type: 'undefined',
        name: ''
      }
    ],
    addToPersonalList: jest.fn(),
    removeFromPersonalList: jest.fn()
  }))
}));

jest.mock('@utils/string');

const queryClient = new QueryClient();

const Component = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AddressDetails />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

describe('AddressDetails', () => {
  it('renders correctly', async () => {
    const { getByTestId } = render(<Component />);
    expect(getByTestId('address-screen')).toBeTruthy();
  });

  it('should render loading spinner when account and explorer info are loading', () => {
    mockedData = {
      address: '',
      enabled: false,
      data: [
        {
          _id: '6200de3b523162b8b87baff1',
          address: '0xF977814e90dA44bFA03b6295A0616a897441aceC',
          ambBalance: 1154670697.424454,
          transactionCount: 17,
          type: 'undefined',
          name: ''
        }
      ],
      loading: true,
      error: false
    };
    const { getByTestId } = render(<Component />);
    expect(getByTestId('loading-spinner')).toBeDefined();
  });

  it('should render error message when there is an account error', () => {
    mockedData = {
      address: '',
      enabled: false,
      data: [
        {
          _id: '6200de3b523162b8b87baff1',
          address: '0xF977814e90dA44bFA03b6295A0616a897441aceC',
          ambBalance: 1154670697.424454,
          transactionCount: 17,
          type: 'undefined',
          name: ''
        }
      ],
      loading: false,
      error: true
    };
    const { getByText } = render(<Component />);
    expect(getByText('Error Occured')).toBeDefined();
  });
});

// Toaster
// FetchNextPage
// Modal
