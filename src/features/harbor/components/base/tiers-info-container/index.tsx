import { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Row, Spacer, Text } from '@components/base';
import { ImportantInfo } from '@components/svg/icons/v2/harbor';
import { DropDownPanel } from '@components/templates';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';
import { styles } from './styles';
import { TierInfoItem } from '../tier-info-item';

interface TierInfoContainerProps {
  onToggleTiers?: (payload?: string) => void;
}

export const TiersInfoContainer = ({
  onToggleTiers
}: TierInfoContainerProps) => {
  const { t } = useTranslation();
  const headerContent = useMemo(
    () => (
      <>
        <ImportantInfo color={COLORS.brand500} />
        <Spacer value={scale(8)} horizontal />
        <Text color={COLORS.neutral900} fontSize={14}>
          {t('harbor.tiers')}
        </Text>
      </>
    ),
    [t]
  );

  const dropDownContent = (
    <View>
      <Row style={styles.dropDownWrapper} justifyContent="space-between">
        <TierInfoItem
          key={1}
          header="harbor.tier.1.header"
          content="harbor.tier.1.content"
        />
        <TierInfoItem
          key={2}
          header="harbor.tier.2.header"
          content="harbor.tier.2.content"
        />
      </Row>
      <Row justifyContent="space-between">
        <TierInfoItem
          key={3}
          header="harbor.tier.3.header"
          content="harbor.tier.3.content"
        />
        <TierInfoItem
          key={4}
          header="harbor.tier.4.header"
          content="harbor.tier.4.content"
        />
      </Row>
      <Spacer value={scale(12)} />
      <Row justifyContent="center">
        <Text color={COLORS.brand600} fontSize={scale(12)}>
          {t('harbor.tier.info')}
        </Text>
      </Row>
    </View>
  );
  return (
    <DropDownPanel
      onPress={onToggleTiers}
      header={headerContent}
      content={dropDownContent}
    />
  );
};
