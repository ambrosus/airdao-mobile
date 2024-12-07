import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { useTranslation } from 'react-i18next';
import { Button, Row, Spacer, Text } from '@components/base';
import { ImportantInfo } from '@components/svg/icons/v2/harbor';
import { scale } from '@utils/scaling';
import { BackIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';

export const TiersInfoContainer = () => {
  const { t } = useTranslation();

  const onTierPress = () => {
    // go to tiers ( modal, screen, accordion)
  };
  return (
    <Button onPress={onTierPress}>
      <Row
        style={styles.main}
        alignItems={'center'}
        justifyContent="space-between"
      >
        <Row alignItems="center">
          <ImportantInfo />
          <Spacer value={scale(8)} horizontal />
          <Text color={COLORS.neutral900} fontSize={14}>
            {t('harbor.tiers')}
          </Text>
        </Row>
        <View style={{ transform: [{ rotate: '270deg' }] }}>
          <BackIcon color={COLORS.neutral900} />
        </View>
      </Row>
    </Button>
  );
};
