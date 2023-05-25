import React from 'react';
import { FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';
import { Button, Row, Text } from '@components/base';
import { HighlightItem } from '@screens/Wallets/components/HomeHighlightsSlider/HighlightItem';

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
  },
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
  },
  {
    time: '2 days ago',
    name: 'AirDAO: Transition to community governance'
  }
];

export const HomeHighlights = () => {
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
        <Button>
          <Text fontFamily="Inter_500Medium" fontSize={14} color="#0e0e0e80">
            See all
          </Text>
        </Button>
      </Row>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={highlightsItems}
        renderItem={({ item }) => <HighlightItem item={item} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: scale(24),
    paddingHorizontal: scale(24)
  }
});
