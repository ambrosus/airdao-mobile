import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { staking } from '@api/staking/staking-service';
import { ReturnedPoolDetails } from '@api/staking/types';
import { HomeParamsList } from '@appTypes';
import { InputRef, Row, Spacer, Text } from '@components/base';
import {
  BottomSheet,
  BottomSheetRef,
  InputWithIcon
} from '@components/composite';
import { PercentageBox } from '@components/composite/PercentageBox';
import { PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { AccountDBModel } from '@database';
import { useBalanceOfAddress, useUSDPrice } from '@hooks';
import {
  CustomAppEvents,
  sendFirebaseEvent
} from '@lib/firebaseEventAnalytics';
import { StakePending } from '@screens/StakingPool/components';
import { NumberUtils, StringUtils, verticalScale } from '@utils';
import { StakePreview } from './Stake.Preview';
import { styles } from './styles';

const WITHDRAW_PERCENTAGES = [25, 50, 75, 100];

type ScrollType = 'focus' | 'blur';

interface StakeTokenProps {
  wallet: AccountDBModel | null;
  apy: number;
  pool: ReturnedPoolDetails | undefined;
  isSwiping: boolean;
  onScroll?: (type: ScrollType) => void;
}

export const StakeToken = ({
  wallet,
  apy,
  pool,
  isSwiping,
  onScroll
}: StakeTokenProps) => {
  const navigation =
    useNavigation<NavigationProp<HomeParamsList, 'StakingPool'>>();
  const { t } = useTranslation();

  const inputRef = useRef<InputRef>(null);
  const previewBottomSheetRef = useRef<BottomSheetRef>(null);

  const [stakeAmount, setStakeAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const { data: ambBalance } = useBalanceOfAddress(wallet?.address || '');
  const stakeAmountUSD = useUSDPrice(parseFloat(stakeAmount || '0'));

  const _onScroll = (type: ScrollType) => {
    if (typeof onScroll === 'function') {
      onScroll(type);
    }
  };
  const showPreview = () => {
    setTimeout(() => {
      previewBottomSheetRef.current?.show();
    }, 500);
    inputRef.current?.blur();
  };

  const onPercentageBoxPress = useCallback(
    (percentage: number) => {
      setStakeAmount(
        NumberUtils.limitDecimalCount(
          (parseFloat(ambBalance?.ether || '0') * percentage) / 100,
          2
        )
      );
    },
    [ambBalance.ether]
  );

  async function simulateNavigationDelay(navigate: () => void) {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    previewBottomSheetRef.current?.dismiss();

    await delay(320);

    navigate();
    setLoading(false);
  }

  const onSubmitStakeTokens = useCallback(async () => {
    if (!pool) return;
    try {
      setLoading(true);
      // @ts-ignore
      const walletHash = wallet?._raw.hash;
      const result = await staking.stake({
        pool,
        value: stakeAmount,
        walletHash
      });

      if (!result) {
        await simulateNavigationDelay(() =>
          navigation.navigate('StakeErrorScreen')
        );
      } else {
        sendFirebaseEvent(CustomAppEvents.stake_finish);
        await simulateNavigationDelay(() =>
          navigation.navigate('StakeSuccessScreen', {
            type: 'stake',
            walletAddress: wallet?.address ?? ''
          })
        );
      }
    } finally {
      setStakeAmount('');
    }
  }, [stakeAmount, pool, navigation, wallet]);

  const onChangeStakeAmount = (value: string) => {
    setStakeAmount(StringUtils.removeNonNumericCharacters(value));
  };

  const isWrongStakeValue = useMemo(() => {
    return {
      message: Number(stakeAmount) < 1000 && stakeAmount !== '',
      button:
        (Number(stakeAmount) < 1000 && stakeAmount !== '') ||
        Number(stakeAmount) > Number(ambBalance.ether) ||
        !stakeAmount ||
        parseFloat(stakeAmount) === 0
    };
  }, [stakeAmount, ambBalance.ether]);

  return (
    <View style={styles.containerStake}>
      <Text
        fontSize={16}
        fontFamily="Inter_500Medium"
        fontWeight="500"
        color={COLORS.neutral900}
      >
        {t('staking.pool.stake.amount')}
      </Text>
      <Spacer value={verticalScale(8)} />
      <InputWithIcon
        onFocus={() => _onScroll('focus')}
        onBlur={() => _onScroll('blur')}
        ref={inputRef}
        focusable={!isSwiping}
        editable={!isSwiping}
        iconRight={
          <View style={styles.currencyBadge}>
            <Text
              color={COLORS.gray800}
              fontSize={14}
              fontFamily="Inter_500Medium"
              fontWeight="500"
            >
              AMB
            </Text>
          </View>
        }
        type="number"
        value={stakeAmount}
        onChangeValue={onChangeStakeAmount}
        placeholder="1000"
        maxLength={12}
      />
      {isWrongStakeValue.message && (
        <>
          <Spacer value={verticalScale(4)} />
          <Text
            fontSize={12}
            fontFamily="Inter_500Medium"
            fontWeight="500"
            color={COLORS.error400}
          >
            {t('staking.pool.stake.warning')}
          </Text>
        </>
      )}
      <Spacer value={verticalScale(8)} />
      <Row alignItems="center" justifyContent="space-between">
        <Text
          fontSize={14}
          fontFamily="Inter_400Regular"
          fontWeight="400"
          color={COLORS.alphaBlack60}
        >
          ${NumberUtils.limitDecimalCount(stakeAmountUSD, 2)}
        </Text>
        <Text
          fontSize={14}
          fontFamily="Inter_400Regular"
          fontWeight="400"
          color={COLORS.alphaBlack60}
        >
          {t('common.balance')}:{' '}
          {NumberUtils.limitDecimalCount(ambBalance?.ether || 0, 2)} AMB
        </Text>
      </Row>
      <Spacer value={verticalScale(24)} />
      <Row
        alignItems="center"
        style={{ flexWrap: 'wrap', gap: verticalScale(16) }}
      >
        {WITHDRAW_PERCENTAGES.map((percentage) => (
          <PercentageBox
            key={percentage}
            onPress={onPercentageBoxPress}
            percentage={percentage}
          />
        ))}
      </Row>
      <Spacer value={verticalScale(24)} />
      <PrimaryButton
        onPress={showPreview}
        disabled={isWrongStakeValue.button || !pool?.active}
      >
        <Text
          color={
            isWrongStakeValue.button ? COLORS.alphaBlack30 : COLORS.neutral0
          }
        >
          {t(
            isWrongStakeValue.button ? 'button.enter.amount' : 'common.review'
          )}
        </Text>
      </PrimaryButton>
      <BottomSheet
        ref={previewBottomSheetRef}
        swiperIconVisible={!loading}
        closeOnBackPress={!loading}
        swipingEnabled={!loading}
      >
        {loading ? (
          <StakePending />
        ) : (
          <StakePreview
            onPressStake={onSubmitStakeTokens}
            walletAddress={wallet?.address || ''}
            amount={parseFloat(stakeAmount)}
            apy={apy}
          />
        )}
        <Spacer value={verticalScale(36)} />
      </BottomSheet>
    </View>
  );
};
