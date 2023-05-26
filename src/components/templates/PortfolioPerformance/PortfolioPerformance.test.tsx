import React from 'react';
import { render } from '@testing-library/react-native';
import { PortfolioPerformance } from '@components/templates';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('victory-native', () => {
  return {
    VictoryChart: jest.fn(),
    VictoryTheme: {},
    VictoryLine: jest.fn(),
    VictoryAxis: jest.fn()
  };
});

const queryClient = new QueryClient();

const Component = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <PortfolioPerformance
          balance="1000"
          currency="USD"
          currencyPosition="left"
          title="Test Portfolio Performance"
          last24HourChange={10.5}
          txFee={0.005}
          timestamp={new Date('2023-05-26T12:00:00Z')}
        />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

describe('PortfolioPerformance', () => {
  it('renders correctly', () => {
    const { getByText, findByText } = render(<Component />);
    expect(getByText('Test Portfolio Performance')).toBeTruthy();
    expect(findByText('1000')).toBeTruthy();
    expect(getByText('24H Change')).toBeTruthy();
    expect(getByText('10.50%')).toBeTruthy();
    expect(getByText('TxFee')).toBeTruthy();
    expect(getByText('0.00500')).toBeTruthy();
    expect(getByText('Time Stamp')).toBeTruthy();
    expect(getByText('2023-05-26')).toBeTruthy();
    expect(getByText('03:00 PM')).toBeTruthy();
  });
});
