import React, { useMemo } from 'react';
import { Button, Row, Spacer, Spinner, Text } from '@components/base';
import { View } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { PrimaryButton } from '@components/modular';
import { Transaction } from '@models';
import moment from 'moment/moment';
import { StringUtils } from '@utils/string';
import { NumberUtils } from '@utils/number';
import { useUSDPrice } from '@hooks';
import { AirDAOTokenLogo } from '@components/svg/icons/AirDAOTokenLogo';
import { styles } from '@components/templates/TransactionModal/styles';
import { useTranslation } from 'react-i18next';

interface TransactionModalProps {
  status: string;
  onPress: () => void;
  transaction: Transaction;
}

export const TransactionModal = ({
  status,
  onPress,
  transaction
}: TransactionModalProps) => {
  const usdPrice = useUSDPrice(transaction?.amount || transaction.value.ether);
  const usdFee = useUSDPrice(transaction.fee);

  const { t } = useTranslation();

  const timeDiff = useMemo(
    // @ts-ignore
    () => moment(transaction.timestamp * 1000).fromNow(),
    [transaction.timestamp]
  );

  return (
    <View
      style={{
        height: status === 'SUCCESS' ? scale(400) : scale(365),
        paddingHorizontal: scale(24)
      }}
    >
      <Spacer value={verticalScale(16)} />
      <Text
        align="center"
        fontFamily="Inter_700Bold"
        fontSize={20}
        color={COLORS.nero}
      >
        {status === 'SUCCESS'
          ? t('transaction.modal.sent')
          : t('transaction.modal.sending')}
      </Text>
      <Spacer value={verticalScale(16)} />
      {status !== 'SUCCESS' && (
        <>
          <Text
            align="center"
            fontFamily="Inter_400Regular"
            fontSize={14}
            color={COLORS.nero}
          >
            {t('transaction.modal.title')}
          </Text>
          <Spacer value={verticalScale(24)} />
          <Spinner />
        </>
      )}
      <Spacer value={verticalScale(16)} />
      <View>
        {status === 'SUCCESS' && (
          <>
            <Row justifyContent="space-between">
              <Text
                fontFamily="Inter_600SemiBold"
                fontSize={16}
                color={COLORS.asphalt}
              >
                {t('transaction.modal.date')}
              </Text>
              <Text
                fontFamily="Inter_500Medium"
                fontSize={16}
                color={COLORS.neutral800}
              >
                {timeDiff}
              </Text>
            </Row>
            <Spacer value={verticalScale(16)} />
          </>
        )}
        <Row justifyContent="space-between">
          <Text
            fontFamily="Inter_600SemiBold"
            fontSize={16}
            color={COLORS.asphalt}
          >
            {status !== 'SUCCESS'
              ? t('transaction.modal.from')
              : t('transaction.modal.status')}
          </Text>
          {status !== 'SUCCESS' ? (
            <Text
              fontFamily="Inter_500Medium"
              fontSize={16}
              color={COLORS.neutral800}
            >
              {StringUtils.formatAddress(transaction.from, 5, 6)}
            </Text>
          ) : (
            <Button type="circular" disabled style={styles.completed}>
              <View style={styles.completedCircle} />
              <Spacer horizontal value={scale(4)} />
              <Text
                style={{ marginRight: 8 }}
                color={COLORS.completedStatus}
                fontFamily="Inter_500Medium"
                fontSize={14}
              >
                {t('transaction.modal.completed')}
              </Text>
            </Button>
          )}
        </Row>
        <Spacer value={verticalScale(16)} />
        <Row justifyContent="space-between">
          <Text
            fontFamily="Inter_600SemiBold"
            fontSize={16}
            color={COLORS.asphalt}
          >
            {status !== 'SUCCESS'
              ? t('transaction.modal.sending.to')
              : t('transaction.modal.recipient')}
          </Text>
          <Text
            fontFamily="Inter_500Medium"
            fontSize={16}
            color={COLORS.neutral800}
          >
            {StringUtils.formatAddress(transaction.to, 5, 6)}
          </Text>
        </Row>
        <Spacer value={verticalScale(16)} />
        <Row justifyContent="space-between">
          <Text
            fontFamily="Inter_600SemiBold"
            fontSize={16}
            color={COLORS.asphalt}
          >
            {t('transaction.modal.amount')}
          </Text>
          <Row alignItems="center">
            <Text
              fontFamily="Inter_700Bold"
              fontSize={16}
              color={COLORS.neutral800}
            >
              {transaction.amount || transaction.value.ether >= 100000
                ? NumberUtils.abbreviateNumber(
                    transaction.amount || transaction.value.ether
                  )
                : NumberUtils.formatNumber(
                    transaction.amount || transaction.value.ether,
                    2
                  )}
              {} AMB{' '}
            </Text>
            <Text
              fontFamily="Inter_500Medium"
              fontSize={14}
              color={COLORS.slateGrey}
            >
              ${NumberUtils.formatNumber(usdPrice, usdPrice > 1 ? 2 : 4)}
            </Text>
          </Row>
        </Row>
        <Spacer value={verticalScale(8)} />
        <Row justifyContent="space-between" alignItems="center">
          <Text
            fontFamily="Inter_600SemiBold"
            fontSize={16}
            color={COLORS.asphalt}
          >
            {t('transaction.modal.estimated.fee')}
          </Text>
          <Row alignItems="center">
            <View style={{ marginRight: scale(-8) }}>
              <AirDAOTokenLogo scale={0.4} />
            </View>
            <Text
              fontFamily="Inter_600SemiBold"
              fontSize={14}
              color={COLORS.neutral800}
            >
              {isNaN(transaction.fee) ? '0 AMB ' : `${transaction.fee} AMB`}
            </Text>
            <Text
              fontFamily="Inter_500Medium"
              fontSize={14}
              color={COLORS.slateGrey}
            >
              ${isNaN(usdFee) ? '0' : NumberUtils.formatNumber(usdFee, 2)}
            </Text>
          </Row>
        </Row>
      </View>
      <Spacer value={verticalScale(16)} />
      <View>
        {status === 'SUCCESS' ? (
          <>
            <Button
              type="circular"
              style={{ backgroundColor: COLORS.smokyBlack5 }}
            >
              <Text
                style={{ marginVertical: verticalScale(12) }}
                fontFamily="Inter_600SemiBold"
                fontSize={16}
                color={COLORS.nero}
              >
                {t('transaction.modal.buttons.explorer')}
              </Text>
            </Button>
            <Spacer value={verticalScale(16)} />
            <Button
              type="circular"
              style={{ backgroundColor: COLORS.smokyBlack5 }}
            >
              <Text
                style={{ marginVertical: verticalScale(12) }}
                fontFamily="Inter_600SemiBold"
                fontSize={16}
                color={COLORS.nero}
              >
                {t('transaction.modal.buttons.share')}
              </Text>
            </Button>
          </>
        ) : (
          <PrimaryButton onPress={onPress}>
            <Text
              fontFamily="Inter_600SemiBold"
              fontSize={16}
              color={COLORS.white}
            >
              {t('transaction.modal.confirm')}
            </Text>
          </PrimaryButton>
        )}
      </View>
    </View>
  );
};
