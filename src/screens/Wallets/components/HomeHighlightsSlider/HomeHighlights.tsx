import React from 'react';
import { FlatList, SafeAreaView } from 'react-native';
import { COLORS } from '@constants/colors';
import { Button, Row, Text } from '@components/base';
import { HighlightItem } from '@screens/Wallets/components/HomeHighlightsSlider/HighlightItem';
import { styles } from '@screens/Wallets/components/HomeHighlightsSlider/styles';

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
