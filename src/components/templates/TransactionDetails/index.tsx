import React, { useRef } from 'react';
import { Linking, View } from 'react-native';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { Button, Row, Spacer, Text } from '@components/base';
import { BottomSheetRef } from '@components/composite';
import { Transaction } from '@models/Transaction';
import { NumberUtils } from '@utils/number';
import { StringUtils } from '@utils/string';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { useAMBPrice } from '@hooks';
import { SharePortfolio } from '../BottomSheetSharePortfolio';
import { styles } from './styles';

interface TransactionDetailsProps {
  transaction: Transaction;
  isShareable?: boolean;
  onPressAddress?: (address: string) => void;
}

const ROW_MARGIN: number = verticalScale(24);

const JustifiedRow = ({ children }: { children: React.ReactNode }) => (
  <Row alignItems="center" justifyContent="space-between">
    {children}
  </Row>
);

export const TransactionDetails = (
  props: TransactionDetailsProps
): JSX.Element => {
  const { transaction, isShareable = true, onPressAddress } = props;
  const shareTransactionModal = useRef<BottomSheetRef>(null);
  const { data: ambData } = useAMBPrice();
  const { t } = useTranslation();
  const ambPrice = ambData ? ambData.priceUSD : -1;
  let totalTransactionAmount;

  if (ambData) {
    const result = transaction.amount * ambPrice;
    totalTransactionAmount =
      result < 1000
        ? NumberUtils.formatNumber(result, 2)
        : NumberUtils.formatNumber(result, 0);
  } else {
    totalTransactionAmount = -1;
  }

  const showShareTransaction = () => {
    shareTransactionModal.current?.show();
  };

  if (!transaction) return <></>;
  const addressesArePressable = typeof onPressAddress === 'function';

  const onPressSendingAddress = () => {
    if (transaction.from && typeof onPressAddress === 'function') {
      onPressAddress(transaction.from);
    }
  };

  const onPressReceivingAddress = () => {
    if (transaction.to && typeof onPressAddress === 'function') {
      onPressAddress(transaction.to);
    }
  };

  return (
    <View testID="Transaction_Details">
      <JustifiedRow>
        <Text
          fontFamily="Inter_600SemiBold"
          fontSize={16}
          color={COLORS.neutral300}
        >
          {t('common.date')}
        </Text>
        <Text
          fontFamily="Inter_500Medium"
          fontSize={16}
          color={COLORS.neutral800}
        >
          {moment(transaction.timestamp).format('MMM DD, YYYY hh:mm')}
        </Text>
      </JustifiedRow>
      <Spacer value={ROW_MARGIN} />
      <JustifiedRow>
        <Text
          color={COLORS.neutral300}
          fontSize={16}
          fontFamily="Inter_600SemiBold"
        >
          {t('common.status')}
        </Text>
        <Row alignItems="center" style={styles.status}>
          <View
            style={{
              height: moderateScale(8),
              width: moderateScale(8),
              borderRadius: moderateScale(4),
              backgroundColor: COLORS.success600
            }}
          />
          <Spacer horizontal value={scale(4)} />
          <Text
            fontSize={14}
            fontFamily="Inter_500Medium"
            color={COLORS.success500}
          >
            {t(`common.transaction.status.${transaction.status}`)}
          </Text>
        </Row>
      </JustifiedRow>
      {transaction.from && (
        <>
          <Spacer value={ROW_MARGIN} />
          <JustifiedRow>
            <Text
              fontFamily="Inter_600SemiBold"
              fontSize={16}
              color={COLORS.neutral300}
            >
              {t('from')}
            </Text>
            <Button
              disabled={!addressesArePressable}
              onPress={onPressSendingAddress}
            >
              <Text
                style={{
                  textDecorationLine: 'underline'
                }}
                color={COLORS.neutral800}
                fontFamily="Inter_600SemiBold"
                fontSize={16}
              >
                {StringUtils.formatAddress(transaction.from, 4, 5)}
              </Text>
            </Button>
          </JustifiedRow>
        </>
      )}
      {transaction.to && (
        <>
          <Spacer value={ROW_MARGIN} />
          <JustifiedRow>
            <Text
              fontFamily="Inter_600SemiBold"
              fontSize={16}
              color={COLORS.neutral300}
            >
              {t('to')}
            </Text>
            <Button
              disabled={!addressesArePressable}
              onPress={onPressReceivingAddress}
            >
              <Text
                color={COLORS.neutral800}
                fontFamily="Inter_600SemiBold"
                fontSize={16}
                style={{
                  textDecorationLine: 'underline'
                }}
              >
                {StringUtils.formatAddress(transaction.to, 4, 5)}
              </Text>
            </Button>
          </JustifiedRow>
        </>
      )}
      <Spacer value={ROW_MARGIN} />
      <JustifiedRow>
        <Text
          fontFamily="Inter_600SemiBold"
          fontSize={16}
          color={COLORS.neutral300}
        >
          {t('amount')}
        </Text>
        <Text
          fontFamily="Mersad_600SemiBold"
          fontSize={16}
          color={COLORS.neutral800}
        >
          {NumberUtils.formatNumber(transaction.amount, 0)} AMB
          <Text
            fontFamily="Inter_500Medium"
            fontSize={14}
            color={COLORS.neutral400}
          >
            {totalTransactionAmount !== -1 && ` $${totalTransactionAmount}`}
          </Text>
        </Text>
      </JustifiedRow>
      <Spacer value={ROW_MARGIN} />
      <JustifiedRow>
        <Text
          fontFamily="Inter_600SemiBold"
          fontSize={16}
          color={COLORS.neutral300}
        >
          {t('transaction.modal.estimated.fee')}
        </Text>
        <Text
          color={COLORS.neutral700}
          fontFamily="Inter_600SemiBold"
          fontSize={14}
        >
          {transaction.fee} AMB
        </Text>
      </JustifiedRow>
      <Spacer value={ROW_MARGIN} />
      <Button
        type="circular"
        style={{ backgroundColor: COLORS.alphaBlack5 }}
        onPress={() =>
          Linking.openURL(`https://airdao.io/explorer/tx/${transaction.hash}/`)
        }
      >
        <Text
          style={{ marginVertical: verticalScale(12) }}
          fontFamily="Inter_600SemiBold"
          fontSize={16}
          color={COLORS.neutral800}
        >
          {t('transaction.modal.buttons.explorer')}
        </Text>
      </Button>
      <Spacer value={verticalScale(16)} />
      <Button
        type="circular"
        style={{ backgroundColor: COLORS.alphaBlack5 }}
        onPress={showShareTransaction}
      >
        <Text
          style={{ marginVertical: verticalScale(12) }}
          fontFamily="Inter_600SemiBold"
          fontSize={16}
          color={COLORS.neutral800}
        >
          {t('transaction.modal.buttons.share')}
        </Text>
      </Button>
      {isShareable && (
        <>
          {/*<Spacer value={ROW_MARGIN} />*/}
          {/*<Button*/}
          {/*  type="circular"*/}
          {/*  style={styles.shareBtn}*/}
          {/*  onPress={showShareTransaction}*/}
          {/*  testID="Show_Share_Transaction_Button"*/}
          {/*>*/}
          {/*  <Row alignItems="center">*/}
          {/*    <ShareIcon color="#000000" />*/}
          {/*    <Spacer value={scale(3.5)} horizontal />*/}
          {/*    <Text>Share transaction</Text>*/}
          {/*  </Row>*/}
          {/*</Button>*/}
        </>
      )}

      <SharePortfolio
        ref={shareTransactionModal}
        balance={NumberUtils.formatNumber(transaction.amount, 0)}
        currency="AMB"
        currencyPosition="right"
        txFee={transaction.fee}
        title="Transaction"
        bottomSheetTitle="Share Transaction"
        timestamp={transaction.timestamp}
      />
    </View>
  );
};
