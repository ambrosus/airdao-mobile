import React, { useEffect, useState } from 'react';
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
import { CryptoCurrencyCode, HomeParamsList } from '@appTypes';
import { StakeToken, StakingInfo } from './components';
import { styles } from './style';
import { WalletPicker } from '@components/templates';
import { useAllAccounts } from '@hooks/database';
import { AccountDBModel } from '@database';
import { WithdrawToken } from './components/Withdraw';
import {
  usePoolDetailsByName,
  useStakingMultiplyContextSelector
} from '@contexts';
import { BigNumber } from 'ethers';
import { TokenUtils } from '@utils/token';

export const StakingPoolScreen = () => {
  const { data: allWallets } = useAllAccounts();
  const { params } = useRoute<RouteProp<HomeParamsList, 'StakingPool'>>();
  const { pool } = params;
  const { t } = useTranslation();
  const currency = CryptoCurrencyCode.AMB;
  const { totalStake, apy } = pool;
  const poolStakingDetails = usePoolDetailsByName(pool.token.name);
  const [selectedWallet, setSelectedWallet] = useState<AccountDBModel | null>(
    allWallets?.length > 0 ? allWallets[0] : null
  );

  const { top } = useSafeAreaInsets();

  const { fetchPoolDetails } = useStakingMultiplyContextSelector();

  useEffect(() => {
    if (selectedWallet?.address) {
      (async () => {
        await fetchPoolDetails(selectedWallet.address);
      })();
    }
  }, [selectedWallet, fetchPoolDetails]);

  const earning =
    (Number(pool.apy) * Number(poolStakingDetails?.user.amb)) / 100;

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
                {TokenUtils.truncatePoolTokenName(pool.token.name)}
              </Text>
            </Row>
          }
          contentRight={
            allWallets.length > 1 && (
              <WalletPicker
                selectedWallet={selectedWallet}
                wallets={allWallets}
                onSelectWallet={setSelectedWallet}
              />
            )
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
              userStaking={poolStakingDetails?.user.raw ?? BigNumber.from(0)}
              earnings={earning}
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
                    <StakeToken
                      pool={poolStakingDetails}
                      wallet={selectedWallet}
                      apy={apy}
                    />
                  </View>
                )
              },
              {
                title: t('staking.pool.withdraw'),
                view: (
                  <>
                    <Spacer value={verticalScale(24)} />
                    <WithdrawToken
                      pool={poolStakingDetails}
                      wallet={selectedWallet}
                      apy={apy}
                    />
                  </>
                )
              }
            ]}
          />
        </KeyboardAvoidingView>
      </KeyboardDismissingView>
    </View>
  );
};
