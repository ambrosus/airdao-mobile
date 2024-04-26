import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { Row, Spacer, Text } from '@components/base';
import {
  BottomSheet,
  BottomSheetRef,
  InputWithIcon
} from '@components/composite';
import { styles } from './styles';
import { COLORS } from '@constants/colors';
import { useTranslation } from 'react-i18next';
import { StringUtils } from '@utils/string';
import { verticalScale } from '@utils/scaling';
import { PercentageBox } from '@components/composite/PercentageBox';
import { NumberUtils } from '@utils/number';
import { PrimaryButton } from '@components/modular';
import { AccountDBModel } from '@database';
import { WithdrawTokenPreview } from './BottomSheet/Withdraw.Preview';
import { ReturnedPoolDetails } from '@api/staking/types';
import { staking } from '@api/staking/staking-service';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { HomeParamsList } from '@appTypes';
import { StakePending } from '@screens/StakingPool/components';

const WITHDRAW_PERCENTAGES = [25, 50, 75, 100];

interface WithdrawTokenProps {
  wallet: AccountDBModel | null;
  apy?: number;
  pool: ReturnedPoolDetails | undefined;
}

export const WithdrawToken = ({ wallet, pool }: WithdrawTokenProps) => {
  const { t } = useTranslation();
  const navigation =
    useNavigation<NavigationProp<HomeParamsList, 'StakingPool'>>();
  const previewBottomSheetRef = useRef<BottomSheetRef>(null);

  const [withdrawAmount, setWithdrawAmount] = useState<string>('');

  const [loading, setLoading] = useState(false);

  const onChangeWithdrawAmount = (value: string) => {
    setWithdrawAmount(StringUtils.removeNonNumericCharacters(value));
  };

  const onPercentSelect = useCallback(
    (percentage: number) => {
      const calculatedToWithdraw = NumberUtils.limitDecimalCount(
        (parseFloat(String(pool?.user?.amb) || '0') * percentage) / 100,
        2
      );

      setWithdrawAmount(calculatedToWithdraw);
    },
    [pool]
  );

  const onWithdrawPreview = () => {
    if (previewBottomSheetRef && previewBottomSheetRef.current) {
      previewBottomSheetRef.current.show();
    }
  };

  const onSubmitWithdrawTokens = useCallback(async () => {
    if (!pool) return;
    try {
      setLoading(true);
      // @ts-ignore
      const walletHash = wallet?._raw.hash;
      const result = await staking.unstake({
        pool,
        value: withdrawAmount,
        walletHash
      });

      if (!result) {
        setTimeout(() => {
          navigation.navigate('StakeErrorScreen');
        }, 100);
      } else {
        setTimeout(() => {
          navigation.navigate('StakeSuccessScreen', {
            type: 'withdraw',
            pool,
            wallet
          });
        }, 100);
      }
    } finally {
      previewBottomSheetRef.current?.dismiss();
      setWithdrawAmount('');
      setTimeout(() => {
        setLoading(false);
      }, 125);
    }
  }, [withdrawAmount, pool, navigation, wallet]);

  const isWrongStakeValue = useMemo(() => {
    return (
      !withdrawAmount ||
      parseFloat(withdrawAmount) === 0 ||
      Number(withdrawAmount) > Number(pool?.user.amb)
    );
  }, [pool, withdrawAmount]);

  const renderCurrencyFieldIcon = useMemo(() => {
    return (
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
    );
  }, []);

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
        iconRight={renderCurrencyFieldIcon}
        value={withdrawAmount}
        onChangeValue={onChangeWithdrawAmount}
        placeholder="0"
        maxLength={12}
        type="number"
      />
      <Spacer value={verticalScale(24)} />
      <Row
        alignItems="center"
        style={{ flexWrap: 'wrap', gap: verticalScale(16) }}
      >
        {WITHDRAW_PERCENTAGES.map((percentage) => (
          <PercentageBox
            key={percentage}
            onPress={onPercentSelect}
            percentage={percentage}
          />
        ))}
      </Row>
      <Spacer value={verticalScale(24)} />
      <PrimaryButton onPress={onWithdrawPreview} disabled={isWrongStakeValue}>
        <Text color={isWrongStakeValue ? COLORS.alphaBlack30 : COLORS.neutral0}>
          {t(isWrongStakeValue ? 'button.enter.amount' : 'button.preview')}
        </Text>
      </PrimaryButton>

      <BottomSheet ref={previewBottomSheetRef} swiperIconVisible>
        {loading ? (
          <StakePending />
        ) : (
          <WithdrawTokenPreview
            onSubmitWithdrawTokens={onSubmitWithdrawTokens}
            wallet={wallet?.address ?? ''}
            amount={parseFloat(withdrawAmount)}
          />
        )}
        <Spacer value={verticalScale(36)} />
      </BottomSheet>
    </View>
  );
};
