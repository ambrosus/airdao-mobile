import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AMBMarket } from '@screens/AMBMarket';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

jest.mock('victory-native', () => {
  return {
    VictoryChart: jest.fn(),
    VictoryTheme: {},
    VictoryLine: jest.fn(),
    VictoryAxis: jest.fn()
  };
});

const queryClient = new QueryClient();

let mockedData = {
  data: {
    _id: '',
    id: 0,
    name: '',
    symbol: '',
    circulatingSupply: 0,
    maxSupply: null,
    totalSupply: 0,
    rank: 0,
    percentChange1H: 0,
    percentChange24H: 0,
    percentChange7D: 0,
    priceUSD: 0,
    volumeUSD: 0,
    marketCapUSD: 0
  },
  loading: false,
  error: false
};

jest.mock('@hooks/query', () => ({
  useAMBPrice: jest.fn(() => mockedData)
}));

jest.mock('@hooks', () => ({
  useFullscreenModalHeight: () => []
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
  it('renders without error', () => {
    render(<Component />);
  });

  it('displays loading spinner when data is not available', async () => {
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
      expect(await getByTestId('spinner'));
    });
    expect(getByTestId('spinner')).toBeDefined();
  });

  it('displays error message when there is an error fetching data', () => {
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
      error: true
    };
    const { getByText } = render(<Component />);
    expect(getByText('Could not fetch AMB Price')).toBeDefined();
  });

  it('displays AMB price and trade button when data is available', () => {
    const { getByText, getByTestId } = render(<Component />);
    expect(getByText('AMB Market')).toBeDefined();
    expect(getByText('Amber (AMB)')).toBeDefined();
    expect(getByTestId('trade-button')).toBeDefined();
  });

  it('opens trade bottom sheet when trade button is pressed', () => {
    const { getByTestId } = render(<Component />);
    const tradeButton = getByTestId('trade-button');
    fireEvent.press(tradeButton);
    expect(getByTestId('trade-bottom-sheet')).toBeDefined();
  });

  it('opens share bottom sheet when share button is pressed', () => {
    const { getByTestId } = render(<Component />);
    const shareButton = getByTestId('share-button');
    fireEvent.press(shareButton);
    expect(getByTestId('share-bottom-sheet')).toBeDefined();
  });
});

// PopUpInfo
// Percent
// text
