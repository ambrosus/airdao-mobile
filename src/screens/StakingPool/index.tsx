import React, { useEffect, useMemo, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { RouteProp, useRoute } from '@react-navigation/native';
import { BigNumber } from 'ethers';
import { styles } from './style';
import { Row, Spacer, Spinner, Text } from '@components/base';
import { Header } from '@components/composite';
import { AnimatedTabs, TokenLogo } from '@components/modular';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { shadow } from '@constants/shadow';
import { CryptoCurrencyCode, HomeParamsList } from '@appTypes';
import { StakingInfo } from './components';
import { WalletPicker } from '@components/templates';
import { useAllAccounts } from '@hooks/database';
import { AccountDBModel } from '@database';
import { WithdrawToken } from './components/Withdraw';
import {
  usePoolDetailsByName,
  useStakingMultiplyContextSelector
} from '@contexts';

import { TokenUtils } from '@utils/token';
import { StakeToken } from './components/Stake/Stake';
import { useBridgeContextSelector } from '@contexts/Bridge';

export const StakingPoolScreen = () => {
  const { selectedAccount } = useBridgeContextSelector();
  const { data: allWallets } = useAllAccounts();
  const { params } = useRoute<RouteProp<HomeParamsList, 'StakingPool'>>();
  const { pool } = params;
  const { t } = useTranslation();
  const currency = CryptoCurrencyCode.AMB;
  const { totalStake, apy } = pool;
  const poolStakingDetails = usePoolDetailsByName(pool.token.name);

  const [currentlySelectedIndex, setCurrentlySelectedIndex] = useState(0);
  const [isTabsSwiping, setIsTabsSwiping] = useState<boolean>(false);
  const [selectedWallet, setSelectedWallet] = useState<AccountDBModel | null>(
    selectedAccount
  );

  const { top } = useSafeAreaInsets();

  const { fetchPoolDetails, isFetching } = useStakingMultiplyContextSelector();

  useEffect(() => {
    if (selectedWallet?.address) {
      (async () => {
        await fetchPoolDetails(selectedWallet.address);
      })();
    }
  }, [selectedWallet, selectedAccount, fetchPoolDetails]);

  const earning =
    (Number(pool.apy) * Number(poolStakingDetails?.user.amb)) / 100;

  // Avoid focusing inputs, while tabs are swiped

  const onSwipeStateHandle = (state: boolean) => {
    if (!state) {
      Keyboard.dismiss();
      setTimeout(() => {
        setIsTabsSwiping(false);
      }, 25);
    } else {
      setIsTabsSwiping(state);
    }
  };

  const onChangedIndex = (idx: number) => setCurrentlySelectedIndex(idx);

  const keyboardVerticalOffset = useMemo(() => {
    return -verticalScale(currentlySelectedIndex === 0 ? 52 : 76);
  }, [currentlySelectedIndex]);

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

      {isFetching ? (
        <View style={styles.spinner}>
          <Spinner />
        </View>
      ) : (
        <>
          <View style={styles.container}>
            <KeyboardAvoidingView
              style={styles.container}
              keyboardVerticalOffset={keyboardVerticalOffset}
              behavior="position"
            >
              <View style={styles.stakingInfoContainer}>
                <StakingInfo
                  totalStake={totalStake}
                  currency={currency}
                  userStaking={
                    poolStakingDetails?.user.raw ?? BigNumber.from(0)
                  }
                  earnings={earning}
                  apy={apy}
                />
              </View>
              <Spacer value={verticalScale(24)} />
              <AnimatedTabs
                dismissOnChangeIndex
                containerStyle={styles.tabsContainer}
                onSwipeStateHandle={onSwipeStateHandle}
                onChangedIndex={onChangedIndex}
                tabs={[
                  {
                    title: t('staking.pool.stake'),
                    view: (
                      <View>
                        <Spacer value={verticalScale(24)} />
                        <StakeToken
                          isSwiping={isTabsSwiping}
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
                          isSwiping={isTabsSwiping}
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
          </View>
        </>
      )}
    </View>
  );
};
