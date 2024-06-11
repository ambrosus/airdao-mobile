import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { styles } from '@components/modular/Bridge/BridgeForm/styles';
import { Row, Spinner, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import React from 'react';
import { BridgeFeeModel } from '@components/modular/Bridge/BridgeForm/BridgeForm';

interface FeeInfoModel {
  amount: string;
  amountSymbol: string;
  feeLoader: boolean;
  bridgeFee: BridgeFeeModel | null;
}

const FeeInfo = ({
  amount,
  amountSymbol,
  feeLoader,
  bridgeFee
}: FeeInfoModel) => {
  const { t } = useTranslation();

  return (
    <View style={styles.information}>
      <Row alignItems="center" justifyContent="space-between">
        <Text
          fontSize={14}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral400}
        >
          {t('bridge.amount.to.receive')}
        </Text>
        <Text fontSize={14} fontFamily="Inter_500Medium" color={COLORS.black}>
          {`${amount} ${amountSymbol}`}
        </Text>
      </Row>
      <Row alignItems="center" justifyContent="space-between">
        {!!amount &&
          (feeLoader ? (
            <Spinner customSize={15} />
          ) : bridgeFee ? (
            <>
              <Text
                fontSize={14}
                fontFamily="Inter_500Medium"
                color={COLORS.neutral400}
              >
                {t('bridge.amount.network.fee')}
              </Text>
              <Text
                fontSize={14}
                fontFamily="Inter_500Medium"
                color={COLORS.black}
              >
                {`${bridgeFee?.feeSymbol} ${bridgeFee?.networkFee}`}
              </Text>
            </>
          ) : (
            <></>
          ))}
      </Row>
    </View>
  );
};

export default FeeInfo;
