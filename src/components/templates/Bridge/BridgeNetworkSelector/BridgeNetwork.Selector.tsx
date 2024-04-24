import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { Button, Row, Text } from '@components/base';
import { TokenLogo } from '@components/modular';
import { ChevronDownIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';

export const BridgeNetworkSelector = () => {
  const { t } = useTranslation();
  return (
    <Row alignItems="center" justifyContent="space-between">
      <View style={styles.container}>
        <Text
          fontSize={14}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral900}
        >
          {t('common.transaction.from')}
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
    </Row>
  );
};
