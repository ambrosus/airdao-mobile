import { StyleSheet, View } from 'react-native';
import { startCase, toLower } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Row, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { verticalScale } from '@utils';
import {
  AMBMarketItem,
  AMBMarketItemsInfo,
  InfoKey
} from '../AMBMarket.constants';

type AMBDetailedInfoProps = {
  [key in InfoKey]: string;
};

export function AMBDetailedInfo(props: AMBDetailedInfoProps): JSX.Element {
  const { t } = useTranslation();
  const renderRow = (row: AMBMarketItem) => {
    return (
      <Row
        key={row.title}
        alignItems="center"
        justifyContent="space-between"
        style={styles.item}
      >
        <Text
          fontSize={14}
          color={COLORS.neutral400}
          fontFamily="Inter_500Medium"
        >
          {startCase(toLower(t(row.title)))}
        </Text>

        <Text
          numberOfLines={1}
          fontSize={14}
          color={COLORS.neutral800}
          fontFamily="Inter_500Medium"
        >
          {props[row.key]}
        </Text>
      </Row>
    );
  };

  return (
    <View>
      {Object.values(AMBMarketItemsInfo)
        .sort((a, b) => a.idx - b.idx)
        .map(renderRow)}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    marginBottom: verticalScale(24)
  }
});
