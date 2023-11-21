import React from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { RouteProp, useRoute } from '@react-navigation/native';
import { KeyboardDismissingView, Row, Spacer, Text } from '@components/base';
import { Header } from '@components/composite';
import { AnimatedTabs, TokenLogo } from '@components/modular';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { shadow } from '@constants/shadow';
import { HomeParamsList } from '@appTypes';
import { AirDAODictTypes } from '@crypto/common/AirDAODictTypes';
import { StakeToken, StakingInfo } from './components';
import { styles } from './style';

export const StakingPoolScreen = () => {
  const { params } = useRoute<RouteProp<HomeParamsList, 'StakingPool'>>();
  const { pool } = params;
  const { t } = useTranslation();
  const currency = AirDAODictTypes.Code.AMB;
  const { totalStake, userStake, earnings, apy } = pool;

  const { top } = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View
        style={{
          paddingTop: top,
          zIndex: 1000,
          backgroundColor: COLORS.neutral0
        }}
      >
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
      </View>

      <KeyboardDismissingView style={styles.container}>
        <KeyboardAvoidingView style={styles.container} behavior="position">
          <View style={styles.stakingInfoContainer}>
            <StakingInfo
              totalStake={totalStake}
              currency={currency}
              userStaking={userStake}
              earnings={earnings}
              apy={apy}
            />
          </View>
          <Spacer value={verticalScale(24)} />
          <AnimatedTabs
            tabs={[
              {
                title: t('staking.pool.stake'),
                view: (
                  <View>
                    <Spacer value={verticalScale(24)} />
                    <StakeToken />
                  </View>
                )
              },
              {
                title: t('staking.pool.withdraw'),
                view: <></>
              }
            ]}
          />
        </KeyboardAvoidingView>
      </KeyboardDismissingView>
    </View>
  );
};
