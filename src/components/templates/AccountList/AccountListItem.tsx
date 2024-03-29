import React from 'react';
import { WalletCard } from '@components/modular';
import { useAMBPrice, useUSDPrice } from '@hooks';
import { useBalanceOfAddress } from '@hooks/query/useBalanceOfAddress';
import { AccountListItemProps, CardType } from './AccountList.types';

export const AccountListItem = (props: AccountListItemProps) => {
  const { account, type } = props;
  const { data: ambBalance, loading: balanceLoading } = useBalanceOfAddress(
    account.address
  );
  const { data: ambPrice } = useAMBPrice();
  const usdBalance = useUSDPrice(Number(ambBalance.ether) || 0);

  switch (type as CardType) {
    case 'credit-card': {
      return (
        <WalletCard
          address={account.address}
          ambBalance={Number(ambBalance.ether)}
          usdBalance={usdBalance}
          balanceLoading={balanceLoading}
          change24HR={ambPrice?.percentChange24H}
          {...props.cardProps}
        />
      );
    }
  }
};
