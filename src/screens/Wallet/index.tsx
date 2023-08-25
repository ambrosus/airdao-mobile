import React, { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlatList, ListRenderItemInfo, View } from 'react-native';
import { Header } from '@components/composite';
import { Button, Spacer, Text } from '@components/base';
import { scale, verticalScale } from '@utils/scaling';
import { useNavigation } from '@react-navigation/native';
import { DatabaseTable } from '@appTypes';
import { AddWalletFlowType, useAddWalletContext } from '@contexts';
import { styles } from '@screens/Wallet/styles';
import { COLORS } from '@constants/colors';
import { PrimaryButton } from '@components/modular';
import { Database, WalletDBModel } from '@database';
import { Wallet } from '@models/Wallet';
import { AddWalletStackNavigationProp } from '@appTypes/navigation/add-wallet';

export const WalletScreen = () => {
  const navigation = useNavigation<AddWalletStackNavigationProp>();
  const { setFlowType, setWalletName, setMnemonicLength } =
    useAddWalletContext();
  const { top } = useSafeAreaInsets();
  const [wallets, setWallets] = useState<Wallet[]>([]);

  const fetchLocalWallets = async () => {
    try {
      const _wallets = (await Database.query(
        DatabaseTable.Wallets
      )) as WalletDBModel[];
      if (_wallets) {
        const mappedWallets = _wallets.map((dbWallet) =>
          Wallet.fromDBModel(dbWallet)
        );
        setWallets(mappedWallets);
      }
    } catch (error) {
      console.log('there was an error fetching wallets');
    }
  };

  useEffect(() => {
    fetchLocalWallets();
  }, []);

  const onCreatePress = () => {
    setFlowType(AddWalletFlowType.CREATE_WALLET);
    setWalletName('');
    setMnemonicLength(128);
    navigation.navigate('CreateWalletStep0');
  };

  // const onRestorePress = () => {
  //   setFlowType(AddWalletFlowType.RESTORE_WALLET);
  //   setWalletName('');
  //   setMnemonicLength(128);
  //   navigation.navigate('RestoreWalletScreen');
  // };

  const renderWallet = (args: ListRenderItemInfo<Wallet>) => {
    const { item, index } = args;
    const onPress = () => {
      navigation.navigate('WalletAccount', { wallet: item });
    };
    return (
      <Button onPress={onPress}>
        <Text>
          {item.name} #{index + 1}
        </Text>
      </Button>
    );
  };

  return (
    <View style={[{ top }, styles.container]}>
      <Header
        title="Add Wallet"
        backIconVisible={false}
        style={styles.header}
      />
      <Spacer value={verticalScale(24)} />
      <View style={{ paddingHorizontal: scale(16) }}>
        <PrimaryButton onPress={onCreatePress}>
          <Text fontFamily="Inter_600SemiBold" color={COLORS.white}>
            Create new wallet
          </Text>
        </PrimaryButton>
        <Spacer value={verticalScale(24)} />
        {/* <PrimaryButton onPress={onRestorePress}>
          <Text fontFamily="Inter_600SemiBold" color={COLORS.white}>
            Restore address
          </Text>
        </PrimaryButton> */}
      </View>
      <FlatList
        data={wallets}
        keyExtractor={(w) => w.hash}
        renderItem={renderWallet}
      />
    </View>
  );
};
