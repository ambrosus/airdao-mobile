import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { Row, Spacer, Text } from '@components/base';
import { useTranslation } from 'react-i18next';
import { verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { NumberUtils } from '@utils/number';
import { TokenLogo } from '@components/modular';
import { BridgeTransactionHistoryDTO } from '@models/dtos/Bridge';
import { StringUtils } from '@utils/string';
import { Status } from '@components/templates/ExplorerAccount/BridgeTransaction/components/Status/Status';
import { useUSDPrice } from '@hooks';
import { CryptoCurrencyCode } from '@appTypes';
import { NETWORK, timestamp } from '@utils/bridge';

type RowRightItemType = 'default' | 'status' | 'token' | 'amount';

interface BottomSheetBridgeTransactionHistoryProps {
  transaction: BridgeTransactionHistoryDTO;
  confirmations?: number;
}

type RowsStateObject = {
  key: string;
  value: string;
  thumb?: string;
  type: RowRightItemType;
};

const TOKEN_LOGO_DEFAULT_SCALE = 0.5;

export const BottomSheetBridgeTransactionHistory = forwardRef<
  BottomSheetRef,
  BottomSheetBridgeTransactionHistoryProps
>(({ transaction }, bottomSheetRef) => {
  const { t } = useTranslation();
  const transactionTokenAddress = (
    token: string,
    paddingLeft = 5,
    paddingRight = 6
  ) => {
    return token.includes('x')
      ? StringUtils.formatAddress(token, paddingLeft, paddingRight)
      : token;
  };

  const usdPrice = useUSDPrice(
    +transaction.denominatedAmount,
    CryptoCurrencyCode[
      transaction.tokenFrom.name as keyof typeof CryptoCurrencyCode
    ]
  );

  const [rowsFromTransactionObject] = useState<RowsStateObject[]>([
    {
      key: t('common.date'),
      value: timestamp(transaction.timestampStart),
      type: 'default'
    },
    {
      key: t('common.transaction.amount'),
      value: `${NumberUtils.formatAmount(
        transaction.amount,
        3
      )} ${transactionTokenAddress(transaction.tokenFrom.name, 1, 2)}`,
      type: 'amount'
    },
    {
      key: t('common.transaction.from'),
      value: NETWORK[transaction.networkFrom as keyof typeof NETWORK],
      thumb: transaction.networkFrom,
      type: 'token'
    },
    {
      key: t('common.transaction.to'),
      value: NETWORK[transaction.networkTo as keyof typeof NETWORK],
      thumb: transaction.networkTo,
      type: 'token'
    },
    {
      key: t('common.status'),
      value: transaction.transferFinishTxHash,
      type: 'status'
    },
    {
      key: t('bridge.transaction.fee'),
      value: `${NumberUtils.formatAmount(transaction.fee, 3)} AMB`,
      type: 'default'
    }
  ]);

  const isUsdAmountPositive = useMemo(() => {
    return usdPrice > 0.0;
  }, [usdPrice]);

  const renderRightRowItem = useCallback(
    (type: RowRightItemType, value: string, thumb?: string) => {
      switch (type) {
        case 'amount': {
          return (
            <Row style={styles.amountRow} alignItems="center">
              <Text
                fontSize={16}
                fontFamily="Inter_500Medium"
                color={COLORS.neutral800}
              >
                {value}
              </Text>
              <Text
                fontSize={16}
                fontFamily="Inter_500Medium"
                color={COLORS.neutral400}
              >
                {isUsdAmountPositive &&
                  `$${NumberUtils.limitDecimalCount(usdPrice, 3)}`}
              </Text>
            </Row>
          );
        }
        case 'token': {
          return (
            <Row style={styles.tokenRow} alignItems="center">
              <TokenLogo scale={TOKEN_LOGO_DEFAULT_SCALE} token={thumb ?? ''} />
              <Text
                fontSize={16}
                fontFamily="Inter_500Medium"
                color={COLORS.neutral800}
              >
                {value}
              </Text>
            </Row>
          );
        }
        case 'status': {
          return (
            <Row style={styles.tokenRow} alignItems="center">
              <Status status={!value ? 'pending' : 'success'} />
            </Row>
          );
        }
        default: {
          return (
            <Text
              fontSize={16}
              fontFamily="Inter_500Medium"
              color={COLORS.neutral800}
            >
              {value}
            </Text>
          );
        }
      }
    },
    [isUsdAmountPositive, usdPrice]
  );

  return (
    <BottomSheet ref={bottomSheetRef} swiperIconVisible>
      <Spacer value={verticalScale(16)} />
      <View style={styles.container}>
        <Text
          fontSize={20}
          fontFamily="Inter_600SemiBold"
          color={COLORS.neutral800}
          style={styles.heading}
        >
          {t('common.transaction.details')}
        </Text>

        <View style={styles.innerContainer}>
          {rowsFromTransactionObject.map((row) => (
            <Row
              key={row.key}
              justifyContent="space-between"
              alignItems="center"
            >
              <Text>{row.key}</Text>

              {renderRightRowItem(row.type, row.value, row.thumb)}
            </Row>
          ))}
        </View>
      </View>
      <Spacer value={verticalScale(36)} />
    </BottomSheet>
  );
});
