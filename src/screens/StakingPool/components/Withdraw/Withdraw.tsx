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
import { useAllAccounts } from '@hooks/database';
import { StakePending } from '@screens/StakingPool/components';
import { useStakingMultiplyContextSelector } from '@contexts';

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

  const { data: allWallets } = useAllAccounts();
  const [selectedWallet] = useState<AccountDBModel | null>(
    allWallets?.length > 0 ? allWallets[0] : null
  );

  const [withdrawAmount, setWithdrawAmount] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const { data: accounts } = useAllAccounts();
  const selectedAccount = accounts.length > 0 ? accounts[0] : null;

  const { fetchPoolDetails } = useStakingMultiplyContextSelector();

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

  const onSubmitWithdrawTokens = async () => {
    if (!pool) return;
    try {
      setLoading(true);
      // @ts-ignore
      const walletHash = selectedAccount?._raw.hash;
      const result = await staking.unstake({
        pool,
        value: withdrawAmount,
        walletHash
      });

      if (!result) {
        previewBottomSheetRef.current?.dismiss();
        navigation.navigate('StakeErrorScreen');
      } else {
        previewBottomSheetRef.current?.dismiss();
        navigation.navigate('StakeSuccessScreen', { type: 'withdraw' });
      }
    } finally {
      if (selectedWallet?.address) {
        await fetchPoolDetails(selectedWallet.address);
      }
      setWithdrawAmount('');
      previewBottomSheetRef.current?.dismiss();
      setLoading(false);
    }
  };

  const isWrongStakeValue = useMemo(() => {
    return {
      button:
        Number(withdrawAmount) > Number(pool?.user.amb) ||
        !withdrawAmount ||
        parseFloat(withdrawAmount) === 0
    };
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
        onChangeText={onChangeWithdrawAmount}
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
      <PrimaryButton
        onPress={onWithdrawPreview}
        disabled={isWrongStakeValue.button}
      >
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

      <BottomSheet ref={previewBottomSheetRef} swiperIconVisible={true}>
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
