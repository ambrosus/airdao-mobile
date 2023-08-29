import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WalletCard } from '@components/modular';
import {
  useCryptoAccountFromHash,
  useSelectedWalletHash,
  useUSDPrice
} from '@hooks';
import { HomeHeader } from './components';
import { styles } from './styles';
import { Spacer, Spinner } from '@components/base';
import { verticalScale } from '@utils/scaling';
import { WalletTransactionsAndAssets } from '@components/templates';

export const HomeScreen = () => {
  const selectedWalletHash = useSelectedWalletHash();
  const { data: account, loading: accountLoading } =
    useCryptoAccountFromHash(selectedWalletHash);
  const usdPrice = useUSDPrice(account?.ambBalance || 0);

  return (
    <SafeAreaView edges={['top']} testID="Home_Screen">
      <HomeHeader />
      {accountLoading && <Spinner />}
      {account && (
        <>
          <View style={styles.accountCard}>
            <WalletCard
              address={account.address}
              ambBalance={account.ambBalance}
              usdBalance={usdPrice}
            />
          </View>
          <Spacer value={verticalScale(24)} />
          <WalletTransactionsAndAssets address={account.address} />
        </>
      )}
    </SafeAreaView>
  );
};
