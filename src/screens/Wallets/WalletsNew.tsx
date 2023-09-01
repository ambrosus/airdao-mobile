import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WalletTransactionsAndAssets } from '@components/templates';
import { WalletCard } from '@components/modular';
import { Spacer, Spinner } from '@components/base';
import {
  useCryptoAccountFromHash,
  useSelectedWalletHash,
  useUSDPrice
} from '@hooks';
import { verticalScale } from '@utils/scaling';
import { AccountActions, HomeHeader } from './components';
import { styles } from './styles';
import { API } from '@api/api';
import { Transaction } from '@models';

export const HomeScreen = () => {
  const selectedWalletHash = useSelectedWalletHash();
  const { data: account, loading: accountLoading } =
    useCryptoAccountFromHash(selectedWalletHash);
  const usdPrice = useUSDPrice(account?.ambBalance || 0);

  const [tokens, setTokens] = useState<
    {
      address: string;
      name: string;
      balance: { wei: string; ether: number };
    }[]
  >([]);

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchTokensAndTransactions = async () => {
    try {
      const walletWithTokens = '0x4fB246FAf8FAc198f8e5B524E74ABC6755956696';
      const { tokens, transactions } = await API.explorerService.searchWalletV2(
        walletWithTokens
      );
      setTokens(tokens);
      setTransactions(transactions);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTokensAndTransactions();
  }, []);

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
              transactions={transactions}
              tokens={tokens}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};
