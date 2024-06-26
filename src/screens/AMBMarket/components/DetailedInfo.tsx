import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
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
  const [visiblePopUpKey, setVisiblePopUpKey] = useState('');
  const { t } = useTranslation();
  const renderRow = (row: AMBMarketItem) => {
    const onInfoPress = () => {
      setVisiblePopUpKey(row.key);
    };
    return (
      <Row
        key={row.title}
        alignItems="center"
        justifyContent="space-between"
        style={styles.item}
      >
        <Row alignItems="center">
          <Text
            fontSize={14}
            color={COLORS.neutral400}
            fontFamily="Inter_500Medium"
          >
            {t(row.title)}
          </Text>
          <Spacer value={scale(7)} horizontal />
          <PopUpInfo
            onInfoPress={onInfoPress}
            testID={row.testID}
            body={t(row.body)}
            title={t(row.title)}
            isVisible={visiblePopUpKey === row.key}
            onBackdropPress={() => setVisiblePopUpKey('')}
          />
        </Row>
        <Text
          fontSize={13}
          color={COLORS.neutral900}
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
