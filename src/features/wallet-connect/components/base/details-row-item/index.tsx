import { useMemo } from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Row, Text } from '@components/base';
import { RowProps } from '@components/base/Row/Row.types';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';

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
  style?: StyleProp<TextStyle>;
}

export const DetailsRowItem = ({
  field,
  value,
  style
}: DetailsRowItemProps) => {
  const { t } = useTranslation();
  const keys: Record<Keys, string> = {
    REQUEST: t('wallet.connect.request.from'),
    INTERACTING: t('wallet.connect.interacting.address'),
    AMOUNT: t('common.transaction.amount'),
    FEE: t('swap.bottom.sheet.lpfee'),
    APPROVE: t('wallet.connect.amount.approve'),
    SPENDER: t('wallet.connect.spender')
  };

  const rowItemStyle = useMemo<RowProps['style']>(
    () => ({
      columnGap: scale(10)
    }),
    []
  );

  return (
    <Row
      alignItems="center"
      justifyContent="space-between"
      style={rowItemStyle}
    >
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
        numberOfLines={1}
        style={style}
      >
        {value}
      </Text>
    </Row>
  );
};
