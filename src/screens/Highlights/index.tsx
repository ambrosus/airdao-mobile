import React from 'react';
import { FlatList, SafeAreaView } from 'react-native';
import { COLORS } from '@constants/colors';
import { Spacer } from '@components/base';
import { HighlightItem } from '@screens/Wallets/components/HomeHighlightsSlider/HighlightItem';
import { scale } from '@utils/scaling';
import { Header } from '@components/composite';

const highlightsItems: {
  time: string;
  name: string;
}[] = [
  {
    time: '2 days ago',
    name: 'AirDAO: Transition to community governance'
  },
  {
    time: '2 days ago',
    name: 'AirDAO: Transition to community governance'
  },
  {
    time: '2 days ago',
    name: 'AirDAO: Transition to community governance'
  }
];

export const Highlights = () => {
  const separator = () => <Spacer value={scale(25)} />;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        title="Highlights"
        backIconVisible
        titlePosition="left"
        titleStyle={{
          fontFamily: 'Inter_700Bold',
          fontSize: 16,
          color: COLORS.nero
        }}
        style={{ shadowColor: 'transparent' }}
      />
      <FlatList
        ItemSeparatorComponent={separator}
        showsVerticalScrollIndicator={false}
        data={highlightsItems}
        renderItem={({ item }) => (
          <HighlightItem isNewsHighlights item={item} />
        )}
      />
    </SafeAreaView>
  );
};
