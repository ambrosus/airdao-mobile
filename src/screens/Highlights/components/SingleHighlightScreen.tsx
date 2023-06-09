import React from 'react';
import { Image, SafeAreaView, ScrollView, View } from 'react-native';
import { Spacer, Text } from '@components/base';
import { Header } from '@components/composite';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { styles } from '@screens/Highlights/styles';
import { HighlightItemType } from '@appTypes/HighlightsTypes';

type Props = {
  route: {
    params: {
      highlight: HighlightItemType;
    };
  };
};

export const SingleHighlightScreen = ({ route }: Props) => {
  const { name, time, description } = route.params.highlight;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header backIconVisible style={styles.header} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text fontFamily="Inter_700Bold" fontSize={20} color={COLORS.nero}>
            {name}
          </Text>
          <Spacer value={scale(8)} />
          <Text fontFamily="Inter_500Medium" fontSize={12} color={COLORS.nero}>
            {time}
          </Text>
          <Spacer value={scale(12)} />
          <Image
            resizeMode="contain"
            source={require('../../../../assets/images/single-highlight.png')}
          />
          <Spacer value={scale(22)} />
          <Text fontFamily="Inter_500Medium" fontSize={16} color="#393b40">
            {description}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
