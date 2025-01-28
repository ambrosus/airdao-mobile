
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { AMBMarket } from '@screens/AMBMarket';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import clearAllMocks = jest.clearAllMocks;

const queryClient = new QueryClient();

let mockedData = {
  data: {
    _id: '987654210987654',
    id: 12345678902345678,
    name: 'AMB',
    symbol: 'csaaafafa',
    circulatingSupply: 9865,
    maxSupply: null,
    totalSupply: 254716451742,
    rank: 8028974,
    percentChange1H: 909312039120,
    percentChange24H: 345678,
    percentChange7D: 123972345,
    priceUSD: 456789,
    volumeUSD: 22317232,
    marketCapUSD: 87879729
  },
  loading: false,
  error: false
};

jest.mock('@hooks', () => ({
  useAMBPrice: jest.fn(() => ({
    mockedData
  })),
  useFullscreenModalHeight: () => [],
  useAMBPriceHistorical: jest.fn(() => ({
    data: [
      { timestamp: new Date('2022-01-01'), price: 100 },
      { timestamp: new Date('2022-01-02'), price: 200 },
      { timestamp: new Date('2022-01-03'), price: 300 }
    ]
  }))
}));

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({
    params: { address: '' }
  }),
  useNavigation: jest.fn(() => ({
    goBack: jest.fn()
  }))
}));

const Component = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AMBMarket />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};
describe('AMBMarket', () => {
  beforeEach(() => {
    clearAllMocks();
  });

  afterAll(() => {
    clearAllMocks();
  });

  it('displays loading spinner when data is loading', async () => {
    mockedData = {
      data: {
        _id: '98949',
        id: 10,
        name: 'token',
        symbol: 'lslafslkf',
        circulatingSupply: 100,
        maxSupply: null,
        totalSupply: 100000,
        rank: 9000,
        percentChange1H: 878,
        percentChange24H: 5533,
        percentChange7D: 1213,
        priceUSD: 100,
        volumeUSD: 91281820,
        marketCapUSD: 994
      },
      loading: true,
      error: false
    };
    const { getByTestId } = render(<Component />);
    await waitFor(async () => {
      await expect(getByTestId('spinner')).toBeDefined();
    });
  });

  it('renders correctly', async () => {
    const { getByText, getByTestId, getAllByTestId } = render(<Component />);
    expect(getByTestId('AMBMarket_Screen')).toBeDefined();
    const shareButton = getByTestId('Share_Button');
    expect(getByText('Statistics')).toBeDefined();
    expect(shareButton).toBeDefined();
    await waitFor(async () => {
      const title = getAllByTestId('PercentChange_Title')[0];
      expect(title.props.children[1]).toBe('0.00');
      expect(await getByText('1D'));
      expect(await getByText('1W'));
      expect(await getByText('1M'));
      // info
      expect(await getByText('Info'));
      expect(await getByText('Max Supply'));
      expect(await getByText('Total Supply'));
      expect(await getByText('Market Cap'));
      expect(await getByText('Fully Diluted Market Cap'));
      expect(await getByText('Circulating Supply'));
      expect(await getByText('24hr Volume'));
      expect(await getByTestId('max-supply-popupinfo'));
      expect(await getByTestId('total-supply-popupinfo'));
      expect(await getByTestId('market-cap-popupinfo'));
      expect(await getByTestId('diluted-cap-popupinfo'));
      // about
      expect(await getByText('About'));
      expect(
        await getByText(
          'AirDAO is a decentralized autonomous organization governing the Ambrosus blockchain and its network of dApps. As the first DAO to encompass an entire L1 blockchain ecosystem, AirDAO is building an integrated suite of digital products and services that strip away the needless complexity from Web3 and bring its benefits to the average consumer via a single, easy-to-use web interface.'
        )
      );
      expect(await getByText('Website'));
      expect(await getByText('Github'));
      // market
      expect(await getByText('Market'));
      expect(await getByText('Binance'));
      expect(await getByText('KuCoin'));
      expect(await getByText('ProBit Global'));
      expect(await getByText('MEXC'));
    });
  });

  it('opens share bottom sheet when share button is pressed', async () => {
    mockedData = {
      data: {
        _id: '98949',
        id: 10,
        name: 'token',
        symbol: 'lslafslkf',
        circulatingSupply: 100,
        maxSupply: null,
        totalSupply: 100000,
        rank: 9000,
        percentChange1H: 878,
        percentChange24H: 5533,
        percentChange7D: 1213,
        priceUSD: 100,
        volumeUSD: 91281820,
        marketCapUSD: 994
      },
      loading: false,
      error: false
    };
    const { getAllByTestId, getByTestId } = render(<Component />);
    const shareButton = getByTestId('Share_Button');
    await act(async () => {
      await fireEvent.press(shareButton);
    });
    await waitFor(async () => {
      await expect(getAllByTestId('Share_Portfolio_BottomSheet')).toBeDefined();
    });
  });
});
