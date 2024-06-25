import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { Spacer, Text } from '@components/base';
import { PrimaryButton, SecondaryButton } from '@components/modular';
import { SuccessIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { verticalScale } from '@utils/scaling';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeParamsList } from '@appTypes';
import { CommonActions } from '@react-navigation/native';

type Props = NativeStackScreenProps<HomeParamsList, 'SwapSuccessScreen'>;

export const SwapSuccessScreen = ({ route, navigation }: Props) => {
  const { t } = useTranslation();

  const [tokens] = useState(route.params);

  const onDoneTransactionPress = () => navigation.goBack();

  const onNavigateToWallets = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'HomeScreen' }]
      })
    );
  };

  const description = useMemo(() => {
    return `Your swap of ${tokens.AMOUNT_A} ${tokens.SYMBOL_A} to ${tokens.AMOUNT_B} ${tokens.SYMBOL_B} was successful.`;
  }, [tokens.AMOUNT_A, tokens.AMOUNT_B, tokens.SYMBOL_A, tokens.SYMBOL_B]);

  return (
    <SafeAreaView style={styles.container}>
      <SuccessIcon />
      <Spacer value={verticalScale(16)} />
      <Text color={COLORS.neutral800} fontFamily="Inter_700Bold" fontSize={20}>
        {t('staking.pool.success')}
      </Text>
      <Spacer value={verticalScale(8)} />
      <Text
        align="center"
        color={COLORS.neutral600}
        style={styles.description}
        fontSize={16}
        fontFamily="Inter_500Medium"
      >
        {description}
      </Text>
      <View style={styles.footer}>
        <PrimaryButton onPress={onNavigateToWallets}>
          <Text
            fontFamily="Inter_600SemiBold"
            fontSize={16}
            color={COLORS.neutral0}
          >
            Go to wallet
          </Text>
        </PrimaryButton>
        <SecondaryButton onPress={onDoneTransactionPress}>
          <Text
            fontFamily="Inter_600SemiBold"
            fontSize={16}
            color={COLORS.neutral800}
          >
            View details
          </Text>
        </SecondaryButton>
      </View>
    </SafeAreaView>
  );
};
