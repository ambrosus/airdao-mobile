import React from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Text } from '@components/base';
import { COLORS } from '@constants/colors';

type Keys =
  | 'REQUEST'
  | 'INTERACTING'
  | 'AMOUNT'
  | 'FEE'
  | 'APPROVE'
  | 'SPENDER';

interface DetailsRowItemProps {
  field: Keys;
  value: string;
}

export const DetailsRowItem = ({ field, value }: DetailsRowItemProps) => {
  const { t } = useTranslation();
  const keys: Record<Keys, string> = {
    REQUEST: 'Request From',
    INTERACTING: 'Interacting with',
    AMOUNT: t('common.transaction.amount'),
    FEE: t('swap.bottom.sheet.lpfee'),
    APPROVE: 'Amount to approve',
    SPENDER: 'Spender'
  };

  return (
    <Row alignItems="center" justifyContent="space-between">
      <Text
        fontSize={15}
        fontFamily="Inter_500Medium"
        color={COLORS.neutral500}
      >
        {keys[field]}
      </Text>

      <Text
        fontSize={15}
        fontFamily="Inter_500Medium"
        color={COLORS.neutral800}
      >
        {value}
      </Text>
    </Row>
  );
};
