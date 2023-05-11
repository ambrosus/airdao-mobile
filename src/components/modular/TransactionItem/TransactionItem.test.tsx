/* eslint-disable camelcase */
import React from 'react';
import { render } from '@testing-library/react-native';
import { Transaction } from '@models';
import { TransactionItem } from '.';
import { ExplorerAccountType, TransactionType } from '@appTypes/enums';
import dayjs from 'dayjs';

describe('TransactionItem', () => {
  const transaction = new Transaction({
    _id: '1',
    timestamp: new Date().getTime(),
    value: {
      ether: 100,
      wei: '100'
    },
    gasCost: {
      ether: 1,
      wei: '1'
    },
    type: TransactionType.Transfer,
    hash: 'abc123',
    from_id: {
      _id: '1',
      address: 'address',
      balance: {
        wei: '1',
        ether: 1
      },
      byteCode: 'byteCode',
      isContract: true,
      power: 1,
      role: 1,
      timestamp: new Date().getTime(),
      totalTx: 1,
      type: ExplorerAccountType.Account
    },
    to_id: {
      _id: '1',
      address: 'address',
      balance: {
        wei: '1',
        ether: 1
      },
      byteCode: 'byteCode',
      isContract: true,
      power: 1,
      role: 1,
      timestamp: new Date().getTime(),
      totalTx: 1,
      type: ExplorerAccountType.Account
    }
  });

  dayjs().fromNow = jest.fn();

  it('renders the transaction type and amount', () => {
    const { getByText } = render(<TransactionItem transaction={transaction} />);
    expect(getByText(transaction.type)).toBeDefined();
    expect(getByText(`${transaction.amount}`)).toBeDefined();
  });

  it('renders the transaction timestamp and fee', () => {
    const { getByText } = render(<TransactionItem transaction={transaction} />);
    expect(getByText(/ago/)).toBeDefined();
    expect(getByText(`${transaction.fee} TxFee`)).toBeDefined();
  });
});
