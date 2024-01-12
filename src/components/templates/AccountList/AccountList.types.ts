import { FlatListProps } from 'react-native';
import { WalletCardProps } from '@components/modular';
import { AccountDBModel } from '@database';

export type CardType = 'credit-card';

export interface AccountListProps {
  accounts: AccountDBModel[];
  horizontal?: boolean;
  type: CardType;
  listProps?: Omit<
    FlatListProps<AccountDBModel>,
    'data' | 'renderItem' | 'keyExtractor'
  >;
  onPressAccount?: (account: AccountDBModel, index: number) => unknown;
}

export interface BaseAccountListItemProps {
  account: AccountDBModel;
}

export interface CreditCardItemProps extends BaseAccountListItemProps {
  type: 'credit-card';
  cardProps?: Omit<
    WalletCardProps,
    'address' | 'ambBalance' | 'usdBalance' | 'balanceLoading' | 'change24HR'
  >;
}

export type AccountListItemProps = CreditCardItemProps;
