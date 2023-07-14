import React from 'react';
import { render } from '@testing-library/react-native';
import { PortfolioPerformance } from '@components/templates';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const Component = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <PortfolioPerformance
          title="My Portfolio"
          currency="USD"
          currencyPosition="left"
          balance="1000000"
          timestamp={new Date('2023.07.10')}
          last24HourChange={10}
          txFee={0.01}
        />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

describe('PortfolioPerformance', () => {
  it('renders correctly with given props', () => {
    const { getByTestId, getByText } = render(<Component />);
    expect(getByTestId('Portfolio_Performance')).toBeDefined();
    expect(getByText('My Portfolio')).toBeTruthy();
    expect(getByText('0.01000')).toBeTruthy();
    expect(getByText('10.00%')).toBeTruthy();
    expect(getByText('2023-07-10')).toBeTruthy();
    expect(getByText('12:00 am')).toBeTruthy();
  });
});
