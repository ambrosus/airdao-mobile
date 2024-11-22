import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { scale, SCREEN_HEIGHT, verticalScale } from '@utils/scaling';
import { shadow } from '@constants/shadow';
import { CryptoCurrencyCode, HomeParamsList } from '@appTypes';
import { StakingInfo } from './components';
import { WalletPicker } from '@components/templates';
import { useAllAccounts } from '@hooks/database';
import { WithdrawToken } from './components/Withdraw';
import { TokenUtils } from '@utils/token';
import { DeviceUtils } from '@utils/device';
import { useKeyboardHeight } from '@hooks';
import { useWalletStore } from '@entities/wallet';
import { useStakingPoolDetails, useStakingPoolsStore } from '@entities/staking';
import { StakeToken } from '@screens/StakingPool/components/Stake/Stake';

const KEYBOARD_BEHAVIOR = DeviceUtils.isIOS ? 'position' : 'height';
const CURRENCY = CryptoCurrencyCode.AMB;

export const StakingPoolScreen = () => {
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();
  const {
    params: { pool }
  } = useRoute<RouteProp<HomeParamsList, 'StakingPool'>>();

  const { wallet, setWallet } = useWalletStore();
  const { data: allWallets } = useAllAccounts();

  const { fetchPoolDetails, isFetching } = useStakingPoolsStore();
  const poolStakingDetails = useStakingPoolDetails(pool.token.name);

  const [isTabsSwiping, setIsTabsSwiping] = useState<boolean>(false);

  useEffect(() => {
    if (wallet?.address) {
      (async () => {
        await fetchPoolDetails(wallet.address);
      })();
    }
  }, [wallet, fetchPoolDetails]);

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

  const keyboardVerticalOffset = useMemo(() => {
    return Platform.select({
      ios: -verticalScale(SCREEN_HEIGHT / 5.5),
      android: verticalScale(24)
    });
  }, []);

  const scrollViewRef = useRef<ScrollView>(null);
  const keyboardHeight = useKeyboardHeight();

  useEffect(() => {
    if (DeviceUtils.isAndroid && keyboardHeight > 0) {
      scrollViewRef.current?.scrollToEnd();
    }
  }, [keyboardHeight]);

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
                selectedWallet={wallet}
                wallets={allWallets}
                onSelectWallet={setWallet}
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
              ref={scrollViewRef}
              bounces={false}
              scrollEnabled={DeviceUtils.isAndroid}
              contentInsetAdjustmentBehavior="always"
              overScrollMode="never"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.stakingInfoContainer}>
                <StakingInfo
                  totalStake={pool.totalStake}
                  currency={CURRENCY}
                  userStaking={
                    poolStakingDetails?.user.raw ?? BigNumber.from(0)
                  }
                  earnings={earning}
                  apy={pool.apy}
                />
              </View>
              <Spacer value={verticalScale(24)} />
              <AnimatedTabs
                dismissOnChangeIndex
                keyboardShouldPersistTaps="handled"
                containerStyle={styles.tabsContainer}
                onSwipeStateHandle={onSwipeStateHandle}
                tabs={[
                  {
                    title: t('staking.pool.stake'),
                    view: (
                      <>
                        <Spacer value={verticalScale(24)} />
                        <StakeToken
                          isSwiping={isTabsSwiping}
                          pool={poolStakingDetails}
                          wallet={wallet}
                          apy={pool.apy}
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
                          wallet={wallet}
                          apy={pool.apy}
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
