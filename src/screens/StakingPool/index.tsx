import React, { useEffect, useMemo, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { RouteProp, useRoute } from '@react-navigation/native';
import { BigNumber } from 'ethers';
import { styles } from './style';
import { Row, Spacer, Spinner, Text } from '@components/base';
import { Header } from '@components/composite';
import { AnimatedTabs, TokenLogo } from '@components/modular';
import { COLORS } from '@constants/colors';
import { SCREEN_HEIGHT, scale, verticalScale } from '@utils/scaling';
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
import { DeviceUtils } from '@utils/device';

const calculateIOSDistanceBetweenKeyboard = (
  currentlySelectedIndex: number
): number => {
  if (SCREEN_HEIGHT < 710) {
    return currentlySelectedIndex === 0
      ? SCREEN_HEIGHT / 5.5
      : SCREEN_HEIGHT / 4.5;
  }
  return currentlySelectedIndex === 0
    ? SCREEN_HEIGHT / 5.5
    : SCREEN_HEIGHT / 4.75;
};

const KEYBOARD_BEHAVIOR = DeviceUtils.isIOS ? 'position' : 'padding';

export const StakingPoolScreen = () => {
  const { params } = useRoute<RouteProp<HomeParamsList, 'StakingPool'>>();
  const { pool } = params;
  const { totalStake, apy } = pool;
  const { selectedAccount } = useBridgeContextSelector();
  const { data: allWallets } = useAllAccounts();
  const { t } = useTranslation();
  const poolStakingDetails = usePoolDetailsByName(pool.token.name);
  const currency = CryptoCurrencyCode.AMB;

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
    return Platform.select({
      ios: -verticalScale(
        calculateIOSDistanceBetweenKeyboard(currentlySelectedIndex)
      ),
      android: verticalScale(currentlySelectedIndex === 0 ? 24 : 0)
    });
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
          <KeyboardAvoidingView
            style={styles.container}
            contentContainerStyle={styles.contentContainerStyle}
            keyboardVerticalOffset={keyboardVerticalOffset}
            behavior={KEYBOARD_BEHAVIOR}
          >
            <ScrollView
              bounces={false}
              scrollEnabled={DeviceUtils.isAndroid}
              contentInsetAdjustmentBehavior="always"
              overScrollMode="never"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
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
                keyboardShouldPersistTaps="handled"
                containerStyle={styles.tabsContainer}
                onSwipeStateHandle={onSwipeStateHandle}
                onChangedIndex={onChangedIndex}
                tabs={[
                  {
                    title: t('staking.pool.stake'),
                    view: (
                      <>
                        <Spacer value={verticalScale(24)} />
                        <StakeToken
                          isSwiping={isTabsSwiping}
                          pool={poolStakingDetails}
                          wallet={selectedWallet}
                          apy={apy}
                        />
                      </>
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
            </ScrollView>
          </KeyboardAvoidingView>
        </>
      )}
    </View>
  );
};
