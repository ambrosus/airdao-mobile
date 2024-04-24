import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from '@components/modular/Bridge/BridgeNetworkSelectors/styles';
import { Button, Row, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { TokenLogo } from '@components/modular';
import { ChevronDownIcon } from '@components/svg/icons';

interface BridgeNetworkPickerProps {
  destination: 'from' | 'to';
}

export const BridgeNetworkPicker = ({
  destination
}: BridgeNetworkPickerProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text
        fontSize={14}
        fontFamily="Inter_500Medium"
        color={COLORS.neutral900}
      >
        {t(`common.transaction.${destination}`)}
      </Text>
      <Button style={styles.select}>
        <Row alignItems="center" justifyContent="space-between">
          <Row alignItems="center" style={styles.selectInnerRowGap}>
            <TokenLogo scale={0.65} token="amb" />
            <Text
              fontSize={14}
              fontFamily="Inter_500Medium"
              color={COLORS.black}
            >
              {t('common.transaction.from')}
            </Text>
          </Row>

          <ChevronDownIcon color={COLORS.black} />
        </Row>
      </Button>
    </View>
  );
};
