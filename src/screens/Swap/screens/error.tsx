import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { Spacer, Text } from '@components/base';
import { PrimaryButton } from '@components/modular';
import { FailedIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { verticalScale } from '@utils/scaling';
import { HomeParamsList } from '@appTypes';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<HomeParamsList, 'SwapErrorScreen'>;

export const SwapErrorScreen = ({ navigation, route }: Props) => {
  const { t } = useTranslation();

  const [tokens] = useState(route.params);

  const onErrorTransactionPress = () => navigation.goBack();

  const description = useMemo(() => {
    return `Your swap of ${tokens.AMOUNT_A} ${tokens.SYMBOL_A} to ${tokens.AMOUNT_B} ${tokens.SYMBOL_B} was successful.`;
  }, [tokens.AMOUNT_A, tokens.AMOUNT_B, tokens.SYMBOL_A, tokens.SYMBOL_B]);

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
        Swap Failed
      </Text>

      <View style={styles.footer}>
        <PrimaryButton
          colors={[COLORS.alphaBlack5, COLORS.alphaBlack5]}
          onPress={onErrorTransactionPress}
        >
          <Text
            fontFamily="Inter_600SemiBold"
            fontSize={16}
            color={COLORS.neutral800}
          >
            {description}
          </Text>
        </PrimaryButton>
        <Spacer value={verticalScale(16)} />
        <PrimaryButton onPress={onErrorTransactionPress}>
          <Text
            fontFamily="Inter_600SemiBold"
            fontSize={16}
            color={COLORS.neutral0}
          >
            {t('button.try.again')}
          </Text>
        </PrimaryButton>
      </View>
    </View>
  );
};
