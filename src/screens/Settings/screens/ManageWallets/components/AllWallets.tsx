import React from 'react';
import { Alert, FlatList, ListRenderItemInfo } from 'react-native';
import {
  CommonActions,
  useFocusEffect,
  useNavigation
} from '@react-navigation/native';
import { WalletDBModel } from '@database';
import { useAllWallets } from '@hooks/database';
import { Button, Spacer } from '@components/base';
import { scale, verticalScale } from '@utils/scaling';
import { useSelectedWalletHash } from '@hooks';
import { SettingsTabNavigationProp } from '@appTypes';
import { WalletUtils } from '@utils/wallet';
import { WalletItem } from './Wallet';

export const AllWallets = () => {
  const allWalletsQueryInfo = useAllWallets();
  const allWallets = allWalletsQueryInfo.data;
  const { data: selectedWalletHash } = useSelectedWalletHash();
  const navigation = useNavigation<SettingsTabNavigationProp>();

  useFocusEffect(
    React.useCallback(() => {
      if (allWalletsQueryInfo.refetch) allWalletsQueryInfo.refetch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allWalletsQueryInfo.refetch])
  );

  const changeSelectedWallet = (hash: string) => {
    WalletUtils.changeSelectedWallet(hash);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Wallets' }]
      })
    );
  };

  const renderWallet = (args: ListRenderItemInfo<WalletDBModel>) => {
    const onPress = () => {
      // TODO navigate to EditWallet
      navigation.navigate('SingleWallet', { wallet: args.item });
    };
    const onLongPress = () => {
      // TODO
      Alert.alert(
        `Are you sure to change default wallet to ${args.item.name}`,
        'This will reload the application',
        [
          {
            text: 'Confirm',
            onPress: () => changeSelectedWallet(args.item.hash)
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ]
      );
    };
    const isSelectedWallet = selectedWalletHash === args.item.hash;
    return (
      <Button
        onPress={onPress}
        onLongPress={isSelectedWallet ? undefined : onLongPress}
      >
        <WalletItem wallet={args.item} isSelectedWallet={isSelectedWallet} />
      </Button>
    );
  };

  return (
    <FlatList
      data={allWallets}
      renderItem={renderWallet}
      keyExtractor={(w) => w.hash}
      ItemSeparatorComponent={() => <Spacer value={verticalScale(16)} />}
      contentContainerStyle={{
        paddingHorizontal: scale(18),
        paddingTop: verticalScale(30)
      }}
    />
  );
};
