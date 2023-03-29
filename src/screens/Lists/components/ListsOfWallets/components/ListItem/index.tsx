import React, { FC } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../../../../../constants/colors';
import { OptionsButtonIcon } from '@components/svg/OptionsButtonIcon';

type Props = {
  item: {
    price: string;
    title: string;
    subtitle: string;
  };
};
export const ListItem: FC<Props> = ({ item }) => {
  return (
    <>
      <View style={styles.itemContainer}>
        <View style={styles.itemContainerTitle}>
          <Text style={styles.itemTitle}>{item.title}</Text>
        </View>
        <View style={styles.itemContainerSubtitlePrice}>
          <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
          <Text style={styles.itemPrice}>{item.price}</Text>
        </View>
      </View>
      <View style={styles.itemContainerButtonStyles}>
        <Pressable>
          <OptionsButtonIcon />
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    paddingLeft: 19,
    paddingVertical: 35,
    paddingRight: 180
  },
  itemContainerTitle: {
    justifyContent: 'flex-start',
    paddingBottom: 4
  },
  itemContainerSubtitlePrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between'
  },
  itemContainerButtonStyles: {
    alignItems: 'flex-end',
    paddingRight: 29,
    marginTop: -50
  },
  itemTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 17 },
  itemSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16
  },
  itemPrice: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.lightGrey
  }
});
