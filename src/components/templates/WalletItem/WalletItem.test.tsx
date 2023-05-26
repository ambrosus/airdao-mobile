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
      <WalletItem item={mockAccount} />
    );
    expect(getByTestId('Wallet_Item')).toBeDefined();
    expect(getByText(MockExplorerAccount.name)).toBeDefined();
    expect(MockExplorerAccount.address).toBe(
      '0x19690E7267Adf28c11494248C3d5561bb7aeDBbA'
    );
    expect(MockExplorerAccount._id).toBe('6458d664d186ad9c72f3779c');
    expect(MockExplorerAccount.ambBalance).toBe(1000);
  });
});
