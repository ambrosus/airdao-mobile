import React, { FC } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { COLORS } from '@constants/colors';
import { OptionsButtonIcon } from '@components/svg/OptionsButtonIcon';
import { Spacer } from '@components/base/Spacer';
import { Text } from '@components/base';

type Props = {
  item: {
    tokens: string;
    title: string;
    wallets: string;
  };
};
export const ListItem: FC<Props> = ({ item }) => {
  return (
    <View style={styles.container}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Spacer value={4} />
        <View style={styles.itemSubInfo}>
          <Text style={styles.walletsCount}>{item.wallets}</Text>
          <Text style={styles.tokensCount}>{item.tokens}</Text>
        </View>
      </View>
      <Pressable>
        <OptionsButtonIcon />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 32,
    paddingLeft: 19,
    paddingRight: 29,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemInfo: {},
  itemSubInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 17
  },
  walletsCount: {
    paddingRight: 14,
    fontFamily: 'Inter_400Regular',
    fontSize: 16
  },
  tokensCount: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.lightGrey,
    paddingTop: 2
  }
});
