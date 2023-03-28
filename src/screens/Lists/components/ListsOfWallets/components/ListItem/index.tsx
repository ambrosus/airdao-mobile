import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../../../../../constants/colors';

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
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 17 }}>
            {item.title}
          </Text>
        </View>
        <View style={styles.itemContainerSubtitlePrice}>
          <Text
            style={{
              fontFamily: 'Inter_400Regular',
              fontSize: 16
            }}
          >
            {item.subtitle}
          </Text>
          <Text
            style={{
              fontFamily: 'Inter_500Medium',
              fontSize: 12,
              color: COLORS.lightGrey
            }}
          >
            {item.price}
          </Text>
        </View>
      </View>
      <View style={styles.itemContainerButtonStyles}>
        <Text>button</Text>
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
  }
});
