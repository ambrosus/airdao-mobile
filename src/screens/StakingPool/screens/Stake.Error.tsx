import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { Spacer, Text } from '@components/base';
import { PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { HomeParamsList } from '@appTypes';
import { FailedIcon } from '@components/svg/icons';
import { verticalScale } from '@utils/scaling';

export const StakeErrorScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NavigationProp<HomeParamsList, 'StakeErrorScreen'>>();

  const onErrorTransactionPress = () => navigation.goBack();

  return (
    <View style={styles.container}>
      <FailedIcon />
      <Spacer value={verticalScale(16)} />
      <Text color={COLORS.neutral800} fontFamily="Inter_700Bold" fontSize={20}>
        Transaction failed
      </Text>
      <Spacer value={verticalScale(8)} />
      <Text
        align="center"
        color={COLORS.neutral600}
        style={styles.description}
        fontSize={16}
        fontFamily="Inter_500Medium"
      >
        We encountered a hiccup while processing your staking request.
        Double-check your wallet balance and network connection
      </Text>

      <View style={{ ...styles.footer, bottom: insets.bottom }}>
        <PrimaryButton
          colors={[COLORS.alphaBlack5, COLORS.alphaBlack5]}
          onPress={onErrorTransactionPress}
        >
          <Text
            fontFamily="Inter_600SemiBold"
            fontSize={16}
            color={COLORS.neutral800}
          >
            Retry
          </Text>
        </PrimaryButton>
        <Spacer value={verticalScale(16)} />
        <PrimaryButton onPress={onErrorTransactionPress}>
          <Text
            fontFamily="Inter_600SemiBold"
            fontSize={16}
            color={COLORS.neutral0}
          >
            Done
          </Text>
        </PrimaryButton>
      </View>
    </View>
  );
};
