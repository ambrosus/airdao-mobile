import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PortfolioScreen } from '@screens/Portfolio';
import { SafeAreaProvider } from 'react-native-safe-area-context';

jest.mock('victory-native', () => {
  return {
    VictoryChart: jest.fn(),
    VictoryTheme: {},
    VictoryLine: jest.fn(),
    VictoryAxis: jest.fn()
  };
});

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

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn()
  })
}));

jest.mock('@hooks', () => ({
  useWatchlist: jest.fn(() => ({
    watchlist: mockedData
  })),
  useFullscreenModalHeight: jest.fn(),
  useForwardedRef: jest.fn(),
  useAMBPrice: () => []
}));

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

const queryClient = new QueryClient();

const Component = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <PortfolioScreen />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

describe('PortfolioScreen', () => {
  it('renders correctly', async () => {
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
    const { getByTestId, getByText } = render(<Component />);
    expect(getByTestId('Portfolio_Screen')).toBeTruthy();
    expect(getByTestId('Watchlist')).toBeTruthy();
    expect(getByText('Collections')).toBeTruthy();
    expect(getByTestId('Swipeable_Element')).toBeDefined();
    expect(getByTestId('Create_Collection_Button')).toBeDefined();
  });

  it('renders Collections section with at least 1 collection', async () => {
    mockedListsOfAddressGroup = [
      {
        id: '',
        name: 'Portfolio test collection',
        accounts: [
          {
            _id: '6458d664d186ad9c72f37798',
            address: '0xa7934828a3Db49cb8F0a10CbcC4FFeb69E13f91B',
            ambBalance: 100000000000000,
            transactionCount: 2,
            type: 'account',
            name: ''
          }
        ]
      }
    ];
    const { getByText, getByTestId } = render(<Component />);
    await act(async () => {
      await fireEvent.press(getByText('Collections'));
    });
    await waitFor(async () => {
      await expect(getByTestId('Collections')).toBeTruthy();
    });
    const testCollection = getByText('Portfolio test collection');
    expect(testCollection).not.toBeNull();
    expect(getByTestId('percent-change-text')).toBeTruthy();
    expect(getByText('123.00%')).toBeTruthy();
    expect(getByText('undefined addresses')).toBeTruthy();
  });

  it('should open the create new collection modal on press', async () => {
    const { getByTestId, getByText } = render(<Component />);
    const createCollectionButton = getByTestId('Create_Collection_Button');
    const createCollectionModal = getByTestId('BottomSheetCreateRename');
    await act(async () => {
      await fireEvent.press(getByText('Collections'));
    });
    fireEvent.press(createCollectionButton);
    await act(async () => {
      await fireEvent.press(createCollectionButton);
    });
    await waitFor(async () => {
      expect(createCollectionModal).toBeDefined();
    });
  });

  it('displays address in Watchlists section if there is an address', () => {
    mockedData = [
      {
        _id: '6458d664d186ad9c72f37794',
        address: '0xaa45A61f5cc10e845BAEe43f9b2468B839ABc9Aa',
        ambBalance: 8734567856778,
        transactionCount: 1,
        type: 'account',
        name: ''
      }
    ];
    const { getAllByTestId, getByText } = render(<Component />);
    const watchlistedAddress = getAllByTestId('WalletItem_0');
    expect(watchlistedAddress).toBeDefined();
    expect(getByText('0xaa45...9ABc9Aa')).toBeTruthy();
    expect(getByText('8,734,567,856,778 AMB')).toBeTruthy();
  });

  it('empty component is displayed on Watchlists section when there are no addresses watchlisted', () => {
    mockedData = [];
    const { getByTestId } = render(<Component />);
    const emptyWatchlist = getByTestId('Empty_Watchlist');
    expect(emptyWatchlist).toBeDefined();
  });

  it('empty component is rendered when there are no collections in collections list', async () => {
    mockedListsOfAddressGroup = [];
    const { getByTestId, getByText } = render(<Component />);
    await act(async () => {
      await fireEvent.press(getByText('Collections'));
    });
    await waitFor(async () => {
      await expect(getByText('No collections yet')).toBeTruthy();
    });
    const emptyCollections = getByTestId('Empty_Item');
    expect(emptyCollections).toBeDefined();
  });
});
