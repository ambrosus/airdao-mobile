import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  AMBMarketItem,
  AMBMarketItemsInfo,
  InfoKey
} from '../AMBMarket.constants';
import { Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { PopUpInfo } from '@components/composite';

type AMBDetailedInfoProps = {
  [key in InfoKey]: string;
};

export function AMBDetailedInfo(props: AMBDetailedInfoProps): JSX.Element {
  const renderRow = (row: AMBMarketItem) => {
    return (
      <Row
        key={row.title}
        alignItems="center"
        justifyContent="space-between"
        style={styles.item}
      >
        <Row alignItems="center">
          <Text
            fontSize={12}
            color={COLORS.slateGrey}
            fontFamily="Inter_500Medium"
          >
            {row.title}
          </Text>
          <Spacer value={scale(7)} horizontal />
          <PopUpInfo testID={row.testID} body={row.body} title={row.title} />
        </Row>
        <Text
          fontSize={13}
          color={COLORS.smokyBlack}
          fontFamily="Mersad_600SemiBold"
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
