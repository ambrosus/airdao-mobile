import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WalletList } from '.';
import { act, fireEvent, render } from '@testing-library/react-native';
import { MockExplorerAccount } from '@mocks/models';

const mockAccount = MockExplorerAccount;

const Component = () => (
  <SafeAreaProvider>
    <WalletList
      title="Test List"
      totalAmount={1000}
      data={[mockAccount]}
      emptyText={'Test Empty'}
    />
  </SafeAreaProvider>
);

const ComponentWithEmptyData = () => (
  <SafeAreaProvider>
    <WalletList
      title="Test List"
      totalAmount={1000}
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

describe('WatchlistAddSuccess Component', () => {
  it('should render correctly', () => {
    const { getByTestId, queryByTestId, getByText } = render(<Component />);
    expect(getByTestId('wallet-list-container')).toBeDefined();
    const toggleBtn = getByTestId('toggle-button');
    expect(toggleBtn).toBeDefined();
    expect(getByText('Test List')).toBeDefined();
    expect(getByTestId('wallet-list-total-amount')).toBeDefined();
    expect(queryByTestId('wallet-list')).toBe(null);
    // toggle list
    act(() => fireEvent.press(toggleBtn));
    expect(getByTestId('wallet-list')).toBeDefined();
  });
  it('should render correctly with empty data', () => {
    const { getByTestId } = render(<ComponentWithEmptyData />);
    expect(getByTestId('wallet-list-container')).toBeDefined();
    const toggleBtn = getByTestId('toggle-button');
    act(() => fireEvent.press(toggleBtn));
    expect(getByTestId('empty-list')).toBeDefined();
  });
});
