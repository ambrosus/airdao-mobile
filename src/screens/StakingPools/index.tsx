import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Header } from '@components/composite';
import { Row, Spacer, Spinner, Text } from '@components/base';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { StakingPoolList } from '@components/templates';
import { HomeNavigationProp } from '@appTypes';
import { StakingPool } from '@models';
import { useAmbrosusStakingPools } from '@hooks';
import { styles } from './styles';
import { useStakingMultiplyContextSelector } from '@contexts';
import { AccountDBModel } from '@database';
import { useAllAccounts } from '@hooks/database';
import { StyleProp, View, ViewStyle } from 'react-native';

export const StakingPoolsScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<HomeNavigationProp>();
  const { data: stakingPools } = useAmbrosusStakingPools();

  const { data: allWallets } = useAllAccounts();
  const [selectedWallet] = useState<AccountDBModel | null>(
    allWallets?.length > 0 ? allWallets[0] : null
  );

  const navigateToPoolScreen = (pool: StakingPool) => {
    navigation.navigate('StakingPool', { pool });
  };

  const { fetchPoolDetails, isFetching } = useStakingMultiplyContextSelector();

  useEffect(() => {
    if (selectedWallet?.address) {
      (async () => {
        await fetchPoolDetails(selectedWallet.address);
      })();
    }
  }, [selectedWallet, fetchPoolDetails]);

  const filterStakingPools = useMemo(() => {
    return stakingPools;
  }, [stakingPools]);

  const spinnerContainerStyle: StyleProp<ViewStyle> = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title={t('staking.header')} />
      <Spacer value={verticalScale(16)} />
      <Row
        alignItems="center"
        justifyContent="space-between"
        style={styles.listHeader}
      >
        <Text
          fontSize={14}
          fontWeight="500"
          fontFamily="Inter_500Medium"
          color={COLORS.neutral300}
        >
          {t('staking.pools')}
        </Text>
        <Text
          fontSize={14}
          fontWeight="500"
          fontFamily="Inter_500Medium"
          color={COLORS.neutral300}
        >
          {t('staking.apy')}
        </Text>
      </Row>
      {isFetching ? (
        <View style={spinnerContainerStyle}>
          <Spinner />
        </View>
      ) : (
        <StakingPoolList
          stakingPools={filterStakingPools}
          contentContainerStyle={{
            paddingHorizontal: scale(16),
            paddingTop: verticalScale(16)
          }}
          ItemSeparatorComponent={() => <Spacer value={verticalScale(16)} />}
          onPressItem={navigateToPoolScreen}
        />
      )}
    </SafeAreaView>
  );
};
