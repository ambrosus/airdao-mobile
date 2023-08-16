import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '@components/composite';
import { Spacer, Text } from '@components/base';
import { scale, verticalScale } from '@utils/scaling';
import { useNavigation } from '@react-navigation/native';
import { AddWalletStackNavigationProp } from '@appTypes';
import { AddWalletFlowType, useAddWalletContext } from '@contexts';
import { styles } from '@screens/Wallet/styles';
import { COLORS } from '@constants/colors';
import { PrimaryButton } from '@components/modular';
import { View } from 'react-native';

export const WalletScreen = () => {
  const navigation = useNavigation<AddWalletStackNavigationProp>();
  const { setFlowType, setWalletName, setMnemonicLength } =
    useAddWalletContext();
  const { top } = useSafeAreaInsets();

  const onCreatePress = () => {
    setFlowType(AddWalletFlowType.CREATE_WALLET);
    setWalletName('');
    setMnemonicLength(128);
    navigation.navigate('CreateWalletStep1');
  };

  const onRestorePress = () => {
    setFlowType(AddWalletFlowType.RESTORE_WALLET);
    setWalletName('');
    setMnemonicLength(128);
    navigation.navigate('RestoreWalletScreen');
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
            Create address
          </Text>
        </PrimaryButton>
        <Spacer value={verticalScale(24)} />
        <PrimaryButton onPress={onRestorePress}>
          <Text fontFamily="Inter_600SemiBold" color={COLORS.white}>
            Restore address
          </Text>
        </PrimaryButton>
      </View>
    </View>
  );
};
