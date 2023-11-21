import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Row, Spacer, Text } from '@components/base';
import { Header } from '@components/composite';
import { TokenLogo } from '@components/modular';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';
import { shadow } from '@constants/shadow';
import { HomeParamsList } from '@appTypes';
import { styles } from './style';
import { View } from 'react-native';
import { StakingInfo } from './components';
import { AirDAODictTypes } from '@crypto/common/AirDAODictTypes';

export const StakingPoolScreen = () => {
  const { params } = useRoute<RouteProp<HomeParamsList, 'StakingPool'>>();
  const { pool } = params;
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={
          <Row alignItems="center">
            <TokenLogo token={pool.token.name} scale={0.75} />
            <Spacer horizontal value={scale(4)} />
            <Text
              fontFamily="Inter_600SemiBold"
              fontSize={15}
              color={COLORS.neutral900}
            >
              {pool.token.name}
            </Text>
          </Row>
        }
        style={{
          ...shadow
        }}
      />
      <View style={styles.stakingInfoContainer}>
        <StakingInfo
          totalStake={pool.totalStake}
          currency={AirDAODictTypes.Code.AMB}
          userStaking={pool.userStake}
          earnings={pool.earnings}
          apy={pool.apy}
        />
      </View>
    </SafeAreaView>
  );
};
