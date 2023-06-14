import React, { useCallback } from 'react';
import { FlatList, SafeAreaView } from 'react-native';
import { COLORS } from '@constants/colors';
import { Button, Row, Spacer, Text } from '@components/base';
import { HighlightItem } from '@screens/Wallets/components/HomeHighlightsSlider/HighlightItem';
import { styles } from '@screens/Wallets/components/HomeHighlightsSlider/styles';
import { verticalScale } from '@utils/scaling';
import { useNavigation } from '@react-navigation/native';
import { WalletsNavigationProp } from '@appTypes';
import { mockedHighlights } from '../../../../mockedData/MockedHighlights';

export const HomeHighlights = () => {
  const navigation = useNavigation<WalletsNavigationProp>();

  const navigateToHighlights = useCallback(() => {
    return navigation.navigate('Highlights');
  }, [navigation]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Row
        style={styles.header}
        justifyContent="space-between"
        alignItems="center"
      >
        <Text
          fontFamily="Inter_700Bold"
          fontSize={20}
          color={COLORS.smokyBlack}
        >
          Highlights
        </Text>
        <Button onPress={navigateToHighlights}>
          <Text fontFamily="Inter_500Medium" fontSize={14} color="#0e0e0e80">
            See all
          </Text>
        </Button>
      </Row>
      <Spacer value={verticalScale(24)} />
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={mockedHighlights}
        renderItem={({ item }) => (
          <HighlightItem isNewsHighlights={false} item={item} />
        )}
      />
    </SafeAreaView>
  );
};
