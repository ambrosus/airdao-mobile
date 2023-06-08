import React, { useCallback } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { Spacer, Text } from '@components/base';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { styles } from '@screens/Wallets/components/HomeHighlightsSlider/styles';
import { useNavigation } from '@react-navigation/native';
import { WalletsNavigationProp } from '@appTypes';

type Props = {
  item: { name: string; time: string };
  isNewsHighlights?: boolean;
};

export const HighlightItem = ({ item, isNewsHighlights }: Props) => {
  const navigation = useNavigation<WalletsNavigationProp>();

  const navigationToSingleHighlight = useCallback(() => {
    navigation.navigate('SingleHighlightScreen');
  }, [navigation]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={navigationToSingleHighlight}
    >
      {isNewsHighlights ? (
        <Image
          style={{
            flex: 1
          }}
          source={require('../../../../../assets/images/single-highlight.png')}
        />
      ) : (
        <Image
          style={{
            flex: 1
          }}
          source={require('../../../../../assets/images/single-home-highlight.png')}
        />
      )}
      <Spacer value={scale(16)} />
      <Text
        fontFamily="Inter_600SemiBold"
        fontSize={14}
        color={COLORS.smokyBlack}
        style={{ maxWidth: 180 }}
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
