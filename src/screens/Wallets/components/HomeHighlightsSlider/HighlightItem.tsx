import React, { useCallback } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { Spacer, Text } from '@components/base';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { styles } from '@screens/Wallets/components/HomeHighlightsSlider/styles';
import { useNavigation } from '@react-navigation/native';
import { WalletsNavigationProp } from '@appTypes';
import { HighlightItemType } from '@appTypes/HighlightsTypes';

type Props = {
  item: HighlightItemType;
  isNewsHighlights?: boolean;
};

export const HighlightItem = ({ item, isNewsHighlights }: Props) => {
  const navigation = useNavigation<WalletsNavigationProp>();

  const navigationToSingleHighlight = useCallback(() => {
    return navigation.navigate('SingleHighlightScreen', { highlight: item });
  }, [navigation, item]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={navigationToSingleHighlight}
    >
      <Image
        style={styles.image}
        source={
          isNewsHighlights
            ? require('../../../../../assets/images/single-highlight.png')
            : require('../../../../../assets/images/single-home-highlight.png')
        }
      />
      <Spacer value={scale(16)} />
      <Text
        fontFamily="Inter_600SemiBold"
        fontSize={14}
        color={COLORS.smokyBlack}
        style={styles.highlightTitle}
      >
        {item.name}
      </Text>
      <Spacer value={scale(8)} />
      <Text
        fontFamily="Inter_500Medium"
        fontSize={12}
        color={COLORS.smokyBlack}
      >
        {item.time}
      </Text>
    </TouchableOpacity>
  );
};
