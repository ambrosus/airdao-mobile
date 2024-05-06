import React, { useRef } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { styles } from './BridgeTransaction.style';

import { TokenLogo } from '@components/modular';
import { scale } from '@utils/scaling';
import { NumberUtils } from '@utils/number';
import { Status } from './components/Status/Status';
import { BottomSheetRef } from '@components/composite';
import { BottomSheetBridgeTransactionHistory } from '@components/templates/BottomSheetBridgeTransactionHistory';
import { BridgeTransactionHistoryDTO } from '@models/dtos/Bridge';
import { Row, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { NETWORK, tokenThumb, transactionFrom } from '@utils/bridge';

interface BridgeTransactionModel {
  transaction: BridgeTransactionHistoryDTO;
}

export const BridgeTransaction = ({ transaction }: BridgeTransactionModel) => {
  const bottomSheetRef = useRef<BottomSheetRef | null>(null);

  const formattedAmount = NumberUtils.formatAmount(transaction.amount, 3);

  const onPreviewTransactionDetails = () => {
    if (bottomSheetRef && bottomSheetRef.current) {
      bottomSheetRef.current?.show();
    }
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={onPreviewTransactionDetails}>
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <Row style={styles.leftContentRow} alignItems="flex-start">
              <TokenLogo
                scale={scale(0.6)}
                token={tokenThumb(transaction.tokenFrom.name)}
              />
              <Text
                fontSize={14}
                fontFamily="Inter_500Medium"
                color="#1D1D1D"
              >{`${formattedAmount} ${transactionFrom(
                transaction.tokenFrom.name
              )}`}</Text>
            </Row>
            <Text
              fontSize={12}
              fontFamily="Inter_500Medium"
              color={COLORS.alphaBlack50}
              numberOfLines={1}
            >
              To: {NETWORK[transaction.networkTo as keyof typeof NETWORK]}
            </Text>
          </View>
          <Status
            status={!transaction.transferFinishTxHash ? 'pending' : 'success'}
          />
        </View>
      </TouchableWithoutFeedback>

      <BottomSheetBridgeTransactionHistory
        ref={bottomSheetRef}
        transaction={transaction}
      />
    </>
  );
};
