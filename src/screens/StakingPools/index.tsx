import React, { useEffect, useMemo, useState } from 'react';
import * as Updates from 'expo-updates';
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
import { useBridgeContextSelector } from '@contexts/Bridge';

export const StakingPoolsScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<HomeNavigationProp>();
  const { data: stakingPools } = useAmbrosusStakingPools();

  const { data: allWallets } = useAllAccounts();
  const { selectedAccount } = useBridgeContextSelector();
  const [selectedWallet] = useState<AccountDBModel | null>(
    selectedAccount ? selectedAccount : allWallets[0]
  );

  const navigateToPoolScreen = (pool: StakingPool) => {
    navigation.navigate('StakingPool', { pool });
  };

  const { fetchPoolDetails, isInitialFetching } =
    useStakingMultiplyContextSelector();

  useEffect(() => {
    if (selectedWallet?.address) {
      (async () => {
        await fetchPoolDetails(selectedWallet.address, true);
      })();
    }
  }, [selectedWallet, fetchPoolDetails]);

  const filterStakingPools = useMemo(() => {
    return Updates.channel === 'testnet'
      ? stakingPools.sort((a, b) => Number(b.isActive) - Number(a.isActive))
      : stakingPools
          .filter((pool) => pool.token.symbol !== 'GPT')
          .sort((a, b) => Number(b.isActive) - Number(a.isActive));
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
          color={COLORS.neutral600}
        >
          {t('staking.pools')}
        </Text>
        <Text
          fontSize={14}
          fontWeight="500"
          fontFamily="Inter_500Medium"
          color={COLORS.neutral600}
        >
          {t('staking.apy')}
        </Text>
      </Row>
      {isInitialFetching ? (
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
