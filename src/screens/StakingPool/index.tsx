import { useEffect, useRef, useState } from 'react';
import { Keyboard, ScrollView, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { BigNumber } from 'ethers';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CryptoCurrencyCode, HomeParamsList } from '@appTypes';
import { Row, Spacer, Spinner, Text } from '@components/base';
import { Header } from '@components/composite';
import { AnimatedTabs, TokenLogo } from '@components/modular';
import { WalletPicker } from '@components/templates';
import { COLORS } from '@constants/colors';
import { shadow } from '@constants/shadow';
import { DEVICE_HEIGHT } from '@constants/variables';
import { useStakingPoolDetails, useStakingPoolsStore } from '@entities/staking';
import { useWalletStore } from '@entities/wallet';
import { useAllAccounts } from '@hooks/database';
import { StakeToken } from '@screens/StakingPool/components/Stake/Stake';
import { TokenUtils, scale, verticalScale } from '@utils';
import { StakingInfo } from './components';
import { WithdrawToken } from './components/Withdraw';
import { styles } from './style';

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
  const [scrollEnabled, setScrollEnabled] = useState(false);
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

  const scrollViewRef = useRef<ScrollView>(null);

  const onScroll = (type: 'focus' | 'blur') => {
    const multiplier = DEVICE_HEIGHT < 822 ? 0.27 : 0.2;

    const value = type === 'focus' ? DEVICE_HEIGHT * multiplier : 0;
    setScrollEnabled(true);
    scrollViewRef?.current?.scrollTo({ y: value, animated: true });
    setScrollEnabled(false);
  };

  return (
    <View style={styles.container}>
      <View style={{ ...styles.wrapper, paddingTop: top }}>
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
          <ScrollView
            ref={scrollViewRef}
            bounces={false}
            scrollEnabled={scrollEnabled}
            contentInsetAdjustmentBehavior="always"
            overScrollMode="never"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.stakingInfoContainer}>
              <StakingInfo
                totalStake={pool.totalStake}
                currency={CURRENCY}
                userStaking={poolStakingDetails?.user.raw ?? BigNumber.from(0)}
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
                        onScroll={onScroll}
                        isSwiping={isTabsSwiping}
                        pool={poolStakingDetails}
                        wallet={wallet}
                        apy={pool.apy}
                      />
                    </>
                  )
                },
                {
                  title: t('staking.pool.unstake'),
                  view: (
                    <>
                      <Spacer value={verticalScale(24)} />
                      <WithdrawToken
                        onScroll={onScroll}
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
            <Spacer value={DEVICE_HEIGHT} />
          </ScrollView>
        </>
      )}
    </View>
  );
};
