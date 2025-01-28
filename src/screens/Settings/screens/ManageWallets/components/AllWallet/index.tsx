import React from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SettingsTabNavigationProp } from '@appTypes';
import { Button } from '@components/base';
import { WalletDBModel } from '@database';
import { useAllAccounts, useAllWallets } from '@hooks/database';
import { WalletItem } from '../Wallet';
import { styles } from './styles';

export const Index = () => {
  const allWalletsQueryInfo = useAllWallets();
  const allWallets = allWalletsQueryInfo.data;
  const navigation = useNavigation<SettingsTabNavigationProp>();
  const { data: allAccounts } = useAllAccounts();

  useFocusEffect(
    React.useCallback(() => {
      if (allWalletsQueryInfo.refetch) allWalletsQueryInfo.refetch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allWalletsQueryInfo.refetch])
  );

  const renderWallet = (args: ListRenderItemInfo<WalletDBModel>) => {
    const account = allAccounts.find(
      // @ts-ignore
      (account) => account._raw?.hash === args.item.hash
    );

    const walletAddress = account?.address || '';

    const onPress = () => {
      navigation.navigate('SingleWallet', { wallet: args.item, walletAddress });
    };

    return (
      <Button onPress={onPress}>
        <WalletItem
          walletAddress={walletAddress}
          index={args.index}
          wallet={args.item}
          isSelectedWallet={false}
        />
      </Button>
    );
  };

  return (
    <FlatList
      data={allWallets}
      renderItem={renderWallet}
      keyExtractor={(w) => w.hash}
      contentContainerStyle={styles.list}
    />
  );
};
