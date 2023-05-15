import React from 'react';
import { MockTransaction } from '@mocks/models';
import { TransactionDetails } from '.';
import { act, fireEvent, render } from '@testing-library/react-native';

const mockTransaction = MockTransaction;

jest.mock(
  'dayjs',
  jest.fn(() => ({
    fromNow: jest.fn
  }))
);

describe('TransactionDetails Component', () => {
  it('renders correctly', () => {
    const { getByTestId, getByText } = render(
      <TransactionDetails transaction={mockTransaction} />
    );
    expect(getByTestId('transaction-details')).toBeDefined();
    expect(getByTestId('transaction-details-from')).toBeDefined();
    expect(getByTestId('transaction-details-to')).toBeDefined();
    expect(getByText(MockTransaction.type)).toBeDefined();
    expect(getByText(MockTransaction.fee.toString())).toBeDefined();
  });
  it('shows SharePortfolio when Share pressed', () => {
    const { getByTestId } = render(
      <TransactionDetails transaction={mockTransaction} />
    );
    const shareBtn = getByTestId('transaction-details-share-button"');
    act(() => fireEvent.press(shareBtn));
  });
});
