import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { Spacer, Spinner, Text } from '@components/base';
import { PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { useAllAccounts } from '@hooks/database';
import { AccountDBModel } from '@database';
import { useStakingMultiplyContextSelector } from '@contexts';

export const StakeSuccessScreen = () => {
  const route = useRoute<RouteProp<HomeParamsList, 'StakeSuccessScreen'>>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const navigation =
    useNavigation<NavigationProp<HomeParamsList, 'StakeSuccessScreen'>>();

  const { data: allWallets } = useAllAccounts();
  const [selectedWallet] = useState<AccountDBModel | null>(
    allWallets?.length > 0 ? allWallets[0] : null
  );

  const [loading, setLoading] = useState(false);

  const { fetchPoolDetails } = useStakingMultiplyContextSelector();
  const refetchPoolDetails = async () => {
    setLoading(true);
    try {
      if (selectedWallet?.address) {
        await fetchPoolDetails(selectedWallet.address);
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
    <View style={styles.container}>
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
      <View style={{ ...styles.footer, bottom: insets.bottom }}>
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
    </View>
  );
};
