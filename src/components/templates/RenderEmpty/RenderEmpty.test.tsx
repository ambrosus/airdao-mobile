import React from 'react';
import { RenderEmpty } from '@components/templates/RenderEmpty/index';
import { render } from '@testing-library/react-native';

describe('ExplorerAccountTransactionItem', () => {
  it('renders correctly', () => {
    const { getByTestId, getByText } = render(
      <RenderEmpty title="collections" />
    );
    expect(getByTestId('Empty_Item')).toBeTruthy();
    expect(getByTestId('Empty_WalletList_Placeholder_Icon')).toBeTruthy();
    expect(getByText('No collections yet'));
  });

  it('renders correctly', () => {
    const { getByTestId, getByText } = render(
      <RenderEmpty title="addresses" />
    );
    expect(getByTestId('Empty_Item')).toBeTruthy();
    expect(getByText('No addresses yet'));
  });
});
