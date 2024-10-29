import React from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { WalletDBModel } from '@database';
import { useAllWallets } from '@hooks/database';
import { Button } from '@components/base';
import { scale, verticalScale } from '@utils/scaling';
import { SettingsTabNavigationProp } from '@appTypes';
import { WalletItem } from './Wallet';

export const AllWallets = () => {
  const allWalletsQueryInfo = useAllWallets();
  const allWallets = allWalletsQueryInfo.data;
  const navigation = useNavigation<SettingsTabNavigationProp>();

  useFocusEffect(
    React.useCallback(() => {
      if (allWalletsQueryInfo.refetch) allWalletsQueryInfo.refetch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allWalletsQueryInfo.refetch])
  );

  const renderWallet = (args: ListRenderItemInfo<WalletDBModel>) => {
    const onPress = () => {
      navigation.navigate('SingleWallet', { wallet: args.item });
    };
    return (
      <Button onPress={onPress}>
        <WalletItem
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
      contentContainerStyle={{
        paddingHorizontal: scale(18),
        paddingTop: verticalScale(15)
      }}
    />
  );
};
