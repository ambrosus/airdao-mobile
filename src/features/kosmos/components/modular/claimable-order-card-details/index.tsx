import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { OrderCardDetails } from '../../base';
import { SecondaryButton } from '@components/modular';
import { Spinner, Text } from '@components/base';
import { TxType } from '@features/kosmos/types';
import { COLORS } from '@constants/colors';
import { getTimeRemaining } from '@features/kosmos/utils';

interface ClaimableOrderCardDetailsProps {
  readonly transaction: TxType;
}

export const ClaimableOrderCardDetails = ({
  transaction
}: ClaimableOrderCardDetailsProps) => {
  const [isClaimingNow, setIsClaimingNow] = useState(false);

  const vestingEndsDate = useMemo(() => {
    return transaction.vestingType === 'Fixed-expiry'
      ? +transaction.vesting
      : +transaction.vesting + transaction.date;
  }, [transaction.date, transaction.vesting, transaction.vestingType]);

  const isVestingPass = useMemo(() => {
    return vestingEndsDate * 1000 < new Date().getTime();
  }, [vestingEndsDate]);

  const disabled = useMemo(() => {
    return isClaimingNow || !isVestingPass;
  }, [isClaimingNow, isVestingPass]);

  const buttonColor = useMemo(() => {
    return disabled ? COLORS.neutral100 : COLORS.brand600;
  }, [disabled]);

  const textColor = useMemo(() => {
    return disabled ? COLORS.neutral400 : COLORS.neutral0;
  }, [disabled]);

  const onButtonPress = useCallback(() => {
    setIsClaimingNow((prevState) => !prevState);
  }, []);

  const textStringValue = useMemo(() => {
    if (transaction.isClaimed) return 'Claimed';
    if (!isVestingPass) return getTimeRemaining(vestingEndsDate);

    return 'Claim';
  }, [transaction.isClaimed, isVestingPass, vestingEndsDate]);

  return (
    <View style={styles.container}>
      <OrderCardDetails transaction={transaction} />

      <SecondaryButton
        disabled={disabled}
        style={{ ...styles.button, backgroundColor: buttonColor }}
        onPress={onButtonPress}
      >
        {isClaimingNow ? (
          <Spinner size="xs" />
        ) : (
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Inter_500Medium',
              color: textColor
            }}
          >
            {textStringValue}
          </Text>
        )}
      </SecondaryButton>
    </View>
  );
};
