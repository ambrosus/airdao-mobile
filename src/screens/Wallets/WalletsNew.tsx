import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WalletTransactionsAndAssets } from '@components/templates';
import { WalletCard } from '@components/modular';
import { Spacer, Spinner } from '@components/base';
import {
  useCryptoAccountFromHash,
  useSelectedWalletHash,
  useTokensAndTransactions,
  useUSDPrice
} from '@hooks';
import { verticalScale } from '@utils/scaling';
import { AccountActions, HomeHeader } from './components';
import { styles } from './styles';

export const HomeScreen = () => {
  const selectedWalletHash = useSelectedWalletHash();
  const { data: account, loading: accountLoading } =
    useCryptoAccountFromHash(selectedWalletHash);
  const usdPrice = useUSDPrice(account?.ambBalance || 0);

  const {
    data: tokensAndTransactions,
    loading,
    error
  } = useTokensAndTransactions(account?.address);

  return (
    <SafeAreaView edges={['top']} testID="Home_Screen">
      <HomeHeader />
      <Spacer value={verticalScale(24)} />
      {accountLoading && <Spinner />}
      {account && (
        <>
          <View>
            <View style={styles.accountCard}>
              <WalletCard
                address={account.address}
                ambBalance={account.ambBalance}
                usdBalance={usdPrice}
              />
            </View>
            <Spacer value={verticalScale(24)} />
            <AccountActions address={account.address} />
            <Spacer value={verticalScale(32)} />
            <WalletTransactionsAndAssets
              account={account.address}
              transactions={tokensAndTransactions?.transactions}
              tokens={tokensAndTransactions?.tokens}
              loading={loading}
              error={error}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};
