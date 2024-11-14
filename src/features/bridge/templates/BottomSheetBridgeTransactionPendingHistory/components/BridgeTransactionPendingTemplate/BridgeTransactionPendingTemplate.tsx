import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { styles } from '@features/bridge/templates/BottomSheetBridgeTransactionPendingHistory/components/BridgeTransactionPendingTemplate/styles';
import { Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { NETWORK, SHORTEN_NETWORK } from '@utils/bridge';
import { Status } from '@features/bridge/templates/BridgeTransaction/components/Status/Status';
import { RowStageSection } from '../RowStageSection/RowStageSection';
import { scale } from '@utils/scaling';
import { BridgeTransactionHistoryDTO } from '@models/dtos/Bridge';

interface BridgeTransactionPendingTemplateModel {
  transaction: BridgeTransactionHistoryDTO;
  onClose?: () => void;
  liveTransactionInformation: {
    stage: string;
    confirmations: {
      current: number;
      minSafetyBlocks: number;
    };
  };
}

export const BridgeTransactionPendingTemplate = ({
  transaction,
  liveTransactionInformation
}: BridgeTransactionPendingTemplateModel) => {
  const { t } = useTranslation();

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

  return (
    <View style={styles.container}>
      <Row
        justifyContent="space-between"
        style={{
          backgroundColor: COLORS.neutral100,
          paddingHorizontal: scale(15),
          paddingVertical: scale(7),
          borderRadius: scale(7)
        }}
      >
        <Text style={styles.description}>
          {t('bridge.transaction.preview.time')}
        </Text>
        <Text color={COLORS.neutral800} style={styles.description}>
          5-20 mins
        </Text>
      </Row>

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
              {t('bridge.transaction.confirmations')}
            </Text>
            <Status
              status={renderTransactionStatus(2.2)}
              steps={{
                start: liveTransactionInformation.confirmations.current,
                end: liveTransactionInformation.confirmations.minSafetyBlocks
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
      <Spacer value={scale(10)} />
    </View>
  );
};
