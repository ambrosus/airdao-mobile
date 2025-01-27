import { useEffect, useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Updates from 'expo-updates';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeNavigationProp } from '@appTypes';
import { Row, Spacer, Spinner, Text } from '@components/base';
import { Header } from '@components/composite';
import { StakingPoolList } from '@components/templates';
import { COLORS } from '@constants/colors';

import { useStakingPoolsStore } from '@entities/staking';
import { useWalletStore } from '@entities/wallet';
import { useAmbrosusStakingPools } from '@hooks';
import { StakingPool } from '@models';
import { scale, verticalScale } from '@utils';
import { styles } from './styles';

export const StakingPoolsScreen = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const { t } = useTranslation();
  const { data: stakingPools } = useAmbrosusStakingPools();
  const { wallet } = useWalletStore();

  const navigateToPoolScreen = (pool: StakingPool) => {
    navigation.navigate('StakingPool', { pool });
  };

  const { fetchPoolDetails, isInitialFetching } = useStakingPoolsStore();

  useEffect(() => {
    if (wallet?.address) {
      (async () => {
        await fetchPoolDetails(wallet.address, true);
      })();
    }
  }, [wallet, fetchPoolDetails]);

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
      <Header bottomBorder title={t('staking.header')} />
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
