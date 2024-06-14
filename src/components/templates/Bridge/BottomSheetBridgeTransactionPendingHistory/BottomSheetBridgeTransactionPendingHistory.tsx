import React, { forwardRef, ReactNode, useCallback } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { Row, Spacer, Spinner, Text } from '@components/base';
import { verticalScale } from '@utils/scaling';
import { BridgeTransactionHistoryDTO } from '@models/dtos/Bridge';
import { NumberUtils } from '@utils/number';
import { COLORS } from '@constants/colors';
import { NETWORK, SHORTEN_NETWORK } from '@utils/bridge';
import { Status } from '@components/templates/Bridge/BridgeTransaction/components/Status/Status';
import { BridgeNetworksSelected } from '@components/templates/Bridge/BridgeNetworksSelected/BridgeNetworksSelected';

interface TransactionPendingModel extends BridgeTransactionHistoryDTO {
  loading?: boolean;
}

interface BottomSheetBridgeTransactionPendingHistoryProps {
  transaction: TransactionPendingModel;
  liveTransactionInformation: {
    stage: string;
    confirmations: {
      current: number;
      minSafetyBlocks: number;
    };
  };
}

export const BottomSheetBridgeTransactionPendingHistory = forwardRef<
  BottomSheetRef,
  BottomSheetBridgeTransactionPendingHistoryProps
>(({ transaction, liveTransactionInformation }, bottomSheetRef) => {
  const { t } = useTranslation();
  const formattedAmount = NumberUtils.formatAmount(transaction?.amount, 3);
  const renderTransactionStatus = useCallback(
    (stage: number) => {
      if (
        +liveTransactionInformation.stage > 2.1 &&
        +liveTransactionInformation.stage < 3 &&
        stage === 2.2
      ) {
        return 'default';
      }

      return +liveTransactionInformation.stage < stage
        ? 'default'
        : +liveTransactionInformation.stage === stage
        ? 'pending'
        : 'success';
    },
    [liveTransactionInformation]
  );
  const TransactionLoader = () => (
    <View
      style={{
        height: 300,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Spinner size={'large'} />
    </View>
  );

  return (
    <BottomSheet ref={bottomSheetRef} swiperIconVisible>
      <Spacer value={verticalScale(16)} />
      {transaction?.loading ? (
        <TransactionLoader />
      ) : (
        <View style={styles.container}>
          <Text
            fontSize={18}
            fontFamily="Inter_700Bold"
            color={COLORS.neutral800}
            style={styles.heading}
          >
            {t('bridge.transaction.sending.heading', {
              tokenFrom: `${formattedAmount} ${transaction?.tokenFrom?.name}`,
              networkTo:
                SHORTEN_NETWORK[transaction?.networkTo as keyof typeof NETWORK]
            })}
          </Text>
          <Text
            fontSize={16}
            fontFamily="Inter_500Medium"
            color={COLORS.neutral400}
            style={styles.description}
          >
            {t('bridge.transaction.details.description')}
          </Text>
          <BridgeNetworksSelected
            networkFrom={transaction?.networkFrom}
            networkTo={transaction?.networkTo}
          />
          <RowStageSection
            stage={1}
            placeholder={t('bridge.transaction.processing')}
          >
            <Status status={renderTransactionStatus(1.1)} />
          </RowStageSection>
          <RowStageSection
            stage={2}
            placeholder={t('bridge.transaction.approval')}
            extraRow={
              <Row
                style={styles.stageExtraRow}
                alignItems="center"
                justifyContent="space-between"
              >
                <Text
                  fontSize={14}
                  fontFamily="Inter_500Medium"
                  color={COLORS.neutral90}
                >
                  Confirmations
                </Text>
                <Status
                  status={renderTransactionStatus(2.2)}
                  steps={{
                    start: liveTransactionInformation.confirmations.current,
                    end: liveTransactionInformation.confirmations
                      .minSafetyBlocks
                  }}
                />
              </Row>
            }
          >
            <Status status={renderTransactionStatus(2.1)} />
          </RowStageSection>
          <RowStageSection
            stage={3}
            placeholder={t('bridge.transaction.sending.funds', {
              networkTo:
                SHORTEN_NETWORK[transaction?.networkTo as keyof typeof NETWORK]
            })}
          >
            <Status status={renderTransactionStatus(3.1)} />
          </RowStageSection>
        </View>
      )}
      <Spacer value={verticalScale(36)} />
    </BottomSheet>
  );
});

const RowStageSection = ({
  children,
  extraRow,
  stage,
  placeholder
}: {
  children: ReactNode;
  extraRow?: ReactNode;
  stage: number;
  placeholder: string;
}) => {
  const { t } = useTranslation();
  return (
    <View style={styles.stageSection}>
      <Text>
        {t('bridge.history.transaction.stage')} {stage}
      </Text>

      <Row alignItems="center" justifyContent="space-between">
        <Text
          fontSize={14}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral90}
        >
          {placeholder}
        </Text>
        {children}
      </Row>
      {extraRow && extraRow}
    </View>
  );
};
