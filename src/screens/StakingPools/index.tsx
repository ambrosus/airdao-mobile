import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Header } from '@components/composite';
import { Row, Spacer, Text } from '@components/base';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { StakingPoolList } from '@components/templates';
import { HomeNavigationProp } from '@appTypes';
import { StakingPool } from '@models';
import { useAmbrosusStakingPools } from '@hooks';
import { styles } from './styles';

export const StakingPoolsScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<HomeNavigationProp>();
  const { data: stakingPools } = useAmbrosusStakingPools();

  const navigateToPoolScreen = (pool: StakingPool) => {
    navigation.navigate('StakingPool', { pool });
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
      <StakingPoolList
        stakingPools={stakingPools.sort(
          (a, b) => Number(b.isActive) - Number(a.isActive)
        )}
        contentContainerStyle={{
          paddingHorizontal: scale(16),
          paddingTop: verticalScale(16)
        }}
        ItemSeparatorComponent={() => <Spacer value={verticalScale(16)} />}
        onPressItem={navigateToPoolScreen}
      />
    </SafeAreaView>
  );
};
