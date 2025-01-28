import { ReactNode } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Row, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { styles } from '@features/bridge/templates/BottomSheetBridgeTransactionPendingHistory/components/BridgeTransactionPendingTemplate/styles';

export const RowStageSection = ({
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
