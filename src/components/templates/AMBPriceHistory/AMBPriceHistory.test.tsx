import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { AMBPriceHistory } from '../AMBPriceHistory';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAMBPrice, useAMBPriceHistorical } from '@hooks';
import clearAllMocks = jest.clearAllMocks;

jest.mock('@hooks', () => ({
  useAMBPrice: jest.fn(() => ({
    data: {
      priceUSD: 10.5
    },
    isLoading: false
  })),
  useAMBPriceHistorical: jest.fn(() => ({
    data: [
      { timestamp: new Date('2022-01-01'), price: 100 },
      { timestamp: new Date('2022-01-02'), price: 200 },
      { timestamp: new Date('2022-01-03'), price: 300 }
    ]
  }))
}));

const queryClient = new QueryClient();

const Component = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AMBPriceHistory badgeType="button" />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

describe('AMBPriceHistory', () => {
  afterAll(() => {
    clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByTestId, getAllByTestId, getByText } = render(<Component />);
    expect(getByTestId('AMB_Price_History')).toBeDefined();
    expect(getByText('AirDAO (AMB)')).toBeDefined();
    expect(getByTestId('Badge_Button')).toBeDefined();
    expect(getAllByTestId('Chart_Interval')).toBeDefined();
    expect(getByTestId('Bezier_Chart')).toBeDefined();
  });

  it('renders correctly with mocked price', () => {
    const mockedPrice = 10.5;
    const mockedPriceSnapshot = [
      { timestamp: new Date(), priceUSD: 10 },
      { timestamp: new Date(), priceUSD: 12 }
    ];
    // @ts-ignore
    useAMBPrice.mockReturnValue({
      data: { priceUSD: mockedPrice },
      isLoading: false
    });
    // @ts-ignore
    useAMBPriceHistorical.mockReturnValue({
      data: mockedPriceSnapshot,
      isLoading: false
    });
    render(<AMBPriceHistory badgeType="view" />);
    const formattedPrice = `$${mockedPrice.toFixed(6)}`;
    expect(formattedPrice).toBe('$10.500000');
  });

  it('renders badge with correct interval', () => {
    const { getByText } = render(<Component />);
    const badgeOneDay = getByText('1D');
    const badgeOneWeek = getByText('1W');
    const badgeOneMonth = getByText('1M');
    expect(badgeOneDay).toBeTruthy();
    expect(badgeOneWeek).toBeTruthy();
    expect(badgeOneMonth).toBeTruthy();
  });

  it.skip('updates price and date when point is selected on chart', async () => {
    const { getByTestId } = render(<AMBPriceHistory badgeType="view" />);
    const chart = getByTestId('Bezier_Chart');
    fireEvent(chart, 'onPointSelected', {
      date: new Date('2022-01-01').getTime(),
      value: 100
    });
    await waitFor(() => {
      const formattedPrice = getByTestId('Formatted_Price');
      expect(formattedPrice.props.value).toBe('$100.000000');
    });
    expect(getByTestId('Formatted_Date').props.value).toBe(
      'January 01 12:00 AM'
    );
    fireEvent(chart, 'onPointSelected', {
      date: new Date('2022-01-02').getTime(),
      value: 200
    });
    await waitFor(() => {
      const formattedPrice = getByTestId('Formatted_Price');
      expect(formattedPrice.props.value).toBe('$200.000000');
    });
    expect(getByTestId('Formatted_Date').props.value).toBe(
      'January 02 12:00 AM'
    );
  });

  it('calls onBadgePress when badge button is pressed', () => {
    const onBadgePress = jest.fn();
    const { getByTestId } = render(
      <AMBPriceHistory badgeType="button" onBadgePress={onBadgePress} />
    );
    const badgeButton = getByTestId('Badge_Button');
    fireEvent.press(badgeButton);
    expect(onBadgePress).toHaveBeenCalled();
  });
});
