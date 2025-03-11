import { useTranslation } from 'react-i18next';
import { Row, Spacer, Text } from '@components/base';
import { LogoGradientCircular } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';

interface EstimatedFeeProps {
  fee: number;
  currency: string;
  currencyPlacement: 'left' | 'right';
}

export const EstimatedFee = (props: EstimatedFeeProps) => {
  const { fee, currency, currencyPlacement } = props;
  const { t } = useTranslation();
  const feeText =
    currencyPlacement === 'left' ? `${currency} ${fee}` : `${fee} ${currency}`;
  return (
    <Row alignItems="center">
      <Text
        color={COLORS.neutral300}
        fontSize={14}
        fontFamily="Inter_600SemiBold"
      >
        {t('send.funds.transfer.fee')}:
      </Text>
      <Spacer value={scale(24)} horizontal />
      <Row alignItems="center">
        <LogoGradientCircular scale={0.67} />
        <Text color={COLORS.neutral700} fontFamily="Inter_600SemiBold">
          {feeText}
        </Text>
      </Row>
    </Row>
  );
};
