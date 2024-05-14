import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { Spacer, Spinner, Text } from '@components/base';
import { PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute
} from '@react-navigation/native';
import { HomeParamsList } from '@appTypes';
import { SuccessIcon } from '@components/svg/icons';
import { verticalScale } from '@utils/scaling';
import { useTranslation } from 'react-i18next';
import { useStakingMultiplyContextSelector } from '@contexts';
import { useBalanceOfAddress, useTokensAndTransactions } from '@hooks';

export const StakeSuccessScreen = () => {
  const route = useRoute<RouteProp<HomeParamsList, 'StakeSuccessScreen'>>();
  const { t } = useTranslation();
  const navigation =
    useNavigation<NavigationProp<HomeParamsList, 'StakeSuccessScreen'>>();

  const { refetch: refetchAmbBalance } = useBalanceOfAddress(
    route.params.walletAddress || ''
  );

  const { refetch: refetchTokensAndAssets } = useTokensAndTransactions(
    route.params.walletAddress || '',
    1,
    20,
    !!route.params.walletAddress
  );

  const [loading, setLoading] = useState(false);

  const { fetchPoolDetails } = useStakingMultiplyContextSelector();
  const refetchPoolDetails = async () => {
    setLoading(true);
    try {
      if (route.params.walletAddress) {
        if (refetchTokensAndAssets) refetchTokensAndAssets();
        if (refetchAmbBalance) refetchAmbBalance();
        await fetchPoolDetails(route.params.walletAddress);
      }
    } finally {
      setLoading(false);
    }
  };

  const onDoneTransactionPress = async () => {
    await refetchPoolDetails();
    navigation.goBack();
  };

  const resolveDetailsTypography = useMemo(() => {
    return route.params.type === 'stake'
      ? t('staking.pool.stake.success')
      : t('staking.pool.withdraw.success');
  }, [route.params.type, t]);

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
        {resolveDetailsTypography}
      </Text>
      <View style={styles.footer}>
        <PrimaryButton disabled={loading} onPress={onDoneTransactionPress}>
          {loading ? (
            <Spinner size="small" />
          ) : (
            <Text
              fontFamily="Inter_600SemiBold"
              fontSize={16}
              color={COLORS.neutral0}
            >
              {t('common.done')}
            </Text>
          )}
        </PrimaryButton>
      </View>
    </SafeAreaView>
  );
};
