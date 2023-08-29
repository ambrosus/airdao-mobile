import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { View } from 'react-native';
import { PrimaryButton } from '@components/modular';
import { useNavigation } from '@react-navigation/native';
import { AddWalletStackNavigationProp } from '@appTypes/navigation/add-wallet';

export const SuccessBackupComplete = () => {
  const navigation = useNavigation<AddWalletStackNavigationProp>();
  const navigateToSetUpSecurity = () => {
    navigation.navigate('WalletScreen');
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: scale(16)
      }}
    >
      <View>
        <Text
          align="center"
          fontSize={24}
          fontFamily="Inter_700Bold"
          color={COLORS.nero}
        >
          Nice move! Backup complete.
        </Text>
        <Spacer value={verticalScale(12)} />
        <Text
          align="center"
          fontSize={16}
          fontFamily="Inter_500Medium"
          color={COLORS.nero}
        >
          You backed up your wallet. Now let’s setup your wallet’s security.
        </Text>
      </View>
      <Spacer value={verticalScale(16)} />
      <PrimaryButton onPress={navigateToSetUpSecurity}>
        <Text
          align="center"
          fontSize={16}
          fontFamily="Inter_500Medium"
          color={COLORS.white}
        >
          Setup security
        </Text>
      </PrimaryButton>
    </SafeAreaView>
  );
};
