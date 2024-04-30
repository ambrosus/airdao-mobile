import React, { forwardRef, useCallback, useState } from 'react';
import { View } from 'react-native';
import { styles } from './styles';

import { Transaction } from '@models';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { Row, Spacer, Text } from '@components/base';
import { useTranslation } from 'react-i18next';
import { verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import moment from 'moment';
import { NumberUtils } from '@utils/number';
import { TokenLogo } from '@components/modular';

type RowRightItemType = 'default' | 'status' | 'token' | 'amount';

interface BottomSheetBridgeTransactionHistoryProps {
  transaction: Transaction;
}

type RowsStateObject = {
  key: string;
  value: string;
  type: RowRightItemType;
};

const TOKEN_LOGO_DEFAULT_SCALE = 0.5;

export const BottomSheetBridgeTransactionHistory = forwardRef<
  BottomSheetRef,
  BottomSheetBridgeTransactionHistoryProps
>(({ transaction }, bottomSheetRef) => {
  const { t } = useTranslation();

  const [rowsFromTransactionObject] = useState<RowsStateObject[]>([
    {
      key: 'Date',
      value: moment(transaction.timestamp).format('MMM DD, YYYY HH:mm'),
      type: 'default'
    },
    {
      key: t('common.transaction.amount'),
      value: NumberUtils.limitDecimalCount(transaction.amount, 2),
      type: 'amount'
    }
  ]);

  const renderRightRowItem = useCallback(
    (type: RowRightItemType, value: string) => {
      switch (type) {
        case 'token': {
          return (
            <Row style={styles.tokenRow} alignItems="center">
              <TokenLogo
                scale={TOKEN_LOGO_DEFAULT_SCALE}
                token={transaction.value.symbol ?? ''}
              />
              <Text>{value}</Text>
            </Row>
          );
        }
        default: {
          return <Text>{value}</Text>;
        }
      }
    },
    [transaction]
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

        <View>
          {rowsFromTransactionObject.map((row) => (
            <Row
              key={row.key}
              justifyContent="space-between"
              alignItems="center"
            >
              <Text>{row.key}</Text>

              {renderRightRowItem(row.type, row.value)}
            </Row>
          ))}
        </View>
      </View>
      <Spacer value={verticalScale(36)} />
    </BottomSheet>
  );
});
