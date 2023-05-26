import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WalletList } from '.';
import { render } from '@testing-library/react-native';
import { MockExplorerAccount } from '@mocks/models';

const mockAccount = MockExplorerAccount;

jest.mock('victory-native', () => {
  return {
    VictoryChart: jest.fn(),
    VictoryTheme: {},
    VictoryLine: jest.fn(),
    VictoryAxis: jest.fn()
  };
});

const Component = () => (
  <SafeAreaProvider>
    <WalletList
      title="Test Collection"
      totalAmount={1000}
      data={[mockAccount]}
      emptyText={'Test Empty'}
    />
  </SafeAreaProvider>
);

const ComponentWithEmptyData = () => (
  <SafeAreaProvider>
    <WalletList
      title="Empty Test Collection"
      totalAmount={0}
      data={[]}
      emptyText={'Test Empty'}
    />
  </SafeAreaProvider>
);

jest.mock('@hooks', () => ({
  useAllAddresses: () => [],
  useForwardedRef: () => [],
  useAMBPrice: () => []
}));

describe('WalletList Component', () => {
  it('should render correctly', () => {
    const { getByTestId, getByText, findByText } = render(<Component />);
    expect(getByText('Test Collection')).toBeDefined();
    expect(findByText('~ $ 1,000')).toBeDefined();
    expect(getByTestId('ToggleButton_WatchList')).toBeDefined();
    expect(getByTestId('AnimatedView')).toBeDefined();
  });
  it('should be rendered correctly with empty data', () => {
    const { getByText, findByText } = render(<ComponentWithEmptyData />);
    expect(getByText('Empty Test Collection')).toBeTruthy();
    expect(findByText('0')).toBeTruthy();
  });
});
