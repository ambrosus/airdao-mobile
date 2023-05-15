import React from 'react';
import { render } from '@testing-library/react-native';
import { WalletItem } from '.';
import { mockUseAMBPrice } from '@mocks/hooks';
import { MockExplorerAccount } from '@mocks/models';

const mockAccount = MockExplorerAccount;
jest.mock('@hooks', () => ({
  useAMBPrice: () => mockUseAMBPrice
}));

describe('WalletItem Component', () => {
  it('renders correctly', () => {
    const { getByTestId, getByText } = render(
      <WalletItem item={mockAccount} testID="wallet-item" />
    );
    expect(getByTestId('wallet-item')).toBeDefined();
    expect(getByText(MockExplorerAccount.name)).toBeDefined();
  });
});
