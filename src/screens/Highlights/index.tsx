import React from 'react';
import { FlatList, SafeAreaView } from 'react-native';
import { Spacer } from '@components/base';
import { HighlightItem } from '@screens/Wallets/components/HomeHighlightsSlider/HighlightItem';
import { scale } from '@utils/scaling';
import { Header } from '@components/composite';
import { styles } from '@screens/Highlights/styles';
import { mockedHighlights } from '../../mockedData/MockedHighlights';

export const Highlights = () => {
  const separator = () => <Spacer value={scale(25)} />;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        title="Highlights"
        backIconVisible
        titlePosition="left"
        titleStyle={styles.title}
        style={styles.header}
      />
      <FlatList
        ItemSeparatorComponent={separator}
        showsVerticalScrollIndicator={false}
        data={mockedHighlights}
        renderItem={({ item }) => (
          <HighlightItem isNewsHighlights item={item} />
        )}
      />
    </SafeAreaView>
  );
};
