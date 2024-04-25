import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Row, Spacer, Text } from '@components/base';
import { PrimaryButton } from '@components/modular';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import {
  BottomSheet,
  BottomSheetRef,
  InputWithIcon
} from '@components/composite';
import { useBalanceOfAddress, useUSDPrice } from '@hooks';
import { AccountDBModel } from '@database';
import { NumberUtils } from '@utils/number';
import { StringUtils } from '@utils/string';
import { StakePreview } from './Stake.Preview';
import { staking } from '@api/staking/staking-service';
import { ReturnedPoolDetails } from '@api/staking/types';
import { useAllAccounts } from '@hooks/database';
import { HomeParamsList } from '@appTypes';
import { StakePending } from '@screens/StakingPool/components';
import { PercentageBox } from '@components/composite/PercentageBox';

const WITHDRAW_PERCENTAGES = [25, 50, 75, 100];

interface StakeTokenProps {
  wallet: AccountDBModel | null;
  apy: number;
  pool: ReturnedPoolDetails | undefined;
}

export const StakeToken = ({ wallet, apy, pool }: StakeTokenProps) => {
  const navigation =
    useNavigation<NavigationProp<HomeParamsList, 'StakingPool'>>();
  const { t } = useTranslation();
  const [stakeAmount, setStakeAmount] = useState('');
  const previewModalRef = useRef<BottomSheetRef>(null);
  const { data: ambBalance } = useBalanceOfAddress(wallet?.address || '');
  const stakeAmountUSD = useUSDPrice(parseFloat(stakeAmount || '0'));

  const showPreview = () => {
    previewModalRef.current?.show();
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

  const { data: accounts } = useAllAccounts();
  const selectedAccount = accounts.length > 0 ? accounts[0] : null;
  const [loading, setLoading] = useState(false);

  const onSubmitStakeTokens = useCallback(async () => {
    if (!pool) return;
    setLoading(true);
    try {
      // @ts-ignore
      const walletHash = selectedAccount?._raw.hash;
      const result = await staking.stake({
        pool,
        value: stakeAmount,
        walletHash
      });

      if (!result) {
        setTimeout(() => {
          navigation.navigate('StakeErrorScreen');
        }, 100);
      } else {
        setTimeout(() => {
          navigation.navigate('StakeSuccessScreen', { type: 'stake', pool });
        }, 100);
      }
    } finally {
      previewModalRef.current?.dismiss();
      setStakeAmount('');
      setTimeout(() => {
        setLoading(false);
      }, 125);
    }
  }, [stakeAmount, pool, navigation, selectedAccount]);

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
    <View style={styles.container}>
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
        placeholder="0"
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
      <PrimaryButton onPress={showPreview} disabled={isWrongStakeValue.button}>
        <Text
          color={
            isWrongStakeValue.button ? COLORS.alphaBlack30 : COLORS.neutral0
          }
        >
          {t(
            isWrongStakeValue.button ? 'button.enter.amount' : 'button.preview'
          )}
        </Text>
      </PrimaryButton>
      <BottomSheet ref={previewModalRef} swiperIconVisible>
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

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(24)
  },
  currencyBadge: {
    paddingHorizontal: scale(8),
    borderWidth: 1,
    borderColor: COLORS.alphaBlack10,
    borderRadius: 1000
  },
  percentageBox: {
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(12),
    backgroundColor: COLORS.alphaBlack5,
    borderRadius: 1000
  }
});
