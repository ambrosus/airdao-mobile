import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { Row, Spacer, Text } from '@components/base';
import { InputWithIcon } from '@components/composite';
import { styles } from './styles';
import { COLORS } from '@constants/colors';
import { useTranslation } from 'react-i18next';
import { StringUtils } from '@utils/string';
import { verticalScale } from '@utils/scaling';
import { PercentageBox } from '@components/composite/PercentageBox';
import { NumberUtils } from '@utils/number';
import { useBalanceOfAddress } from '@hooks';
import { PrimaryButton } from '@components/modular';
import { AccountDBModel } from '@database';

const WITHDRAW_PERCENTAGES = [25, 50, 75, 100];
const _BALANCE = '100000';

interface WithrdawTokenProps {
  wallet: AccountDBModel | null;
  apy?: number;
}

export const WithdrawToken = ({ wallet }: WithrdawTokenProps) => {
  const { t } = useTranslation();

  const { data: balance } = useBalanceOfAddress(wallet?.address || '');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');

  const onChangeWithdrawAmount = (value: string) => {
    setWithdrawAmount(StringUtils.removeNonNumericCharacters(value));
  };

  const onPercentSelect = useCallback(
    (percentage: number) => {
      const calculatedToWithdraw = NumberUtils.limitDecimalCount(
        (parseFloat(balance?.ether || '0') * percentage) / 100,
        2
      );

      setWithdrawAmount(calculatedToWithdraw);
    },
    [balance.ether]
  );

  const onWithdrawPreview = () => {
    console.log('asd');
  };

  const isPreviewDisabled = useMemo(() => {
    return !withdrawAmount || parseFloat(withdrawAmount) === 0;
  }, [withdrawAmount]);

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
      <PrimaryButton onPress={onWithdrawPreview} disabled={isPreviewDisabled}>
        <Text color={isPreviewDisabled ? COLORS.alphaBlack30 : COLORS.neutral0}>
          {t('button.preview')}
        </Text>
      </PrimaryButton>
    </View>
  );
};
