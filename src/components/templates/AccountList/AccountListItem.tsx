import { formatUnits } from 'ethers/lib/utils';
import { WalletCard } from '@components/modular';
import { useAMBPrice, useUSDBigNumberAmount } from '@hooks';
import { useBalanceOfAddress } from '@hooks/query/useBalanceOfAddress';
import { AccountListItemProps, CardType } from './AccountList.types';

export const AccountListItem = (props: AccountListItemProps) => {
  const { account, type } = props;
  const { data: ambBalance, loading: balanceLoading } = useBalanceOfAddress(
    account.address
  );
  const { data: ambPrice } = useAMBPrice();
  const usdBalance = useUSDBigNumberAmount(ambBalance.wei);
  switch (type as CardType) {
    case 'credit-card': {
      return (
        <WalletCard
          address={account.address}
          ambBalance={formatUnits(ambBalance.wei, 18)}
          usdBalance={usdBalance}
          balanceLoading={balanceLoading}
          change24HR={ambPrice?.percentChange24H}
          {...props.cardProps}
        />
      );
    }
  }
};
