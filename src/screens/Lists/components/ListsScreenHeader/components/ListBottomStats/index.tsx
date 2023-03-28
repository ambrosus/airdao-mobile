import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ArrowIcon } from '@components/svg/ArrowIcon';
import { COLORS } from '../../../../../../constants/colors';

type Props = {
  price: string;
  progress: string;
  time: string;
};
export const ListBottomStats: FC<Props> = ({ price, progress, time }) => {
  return (
    <>
      <View style={styles.bottomStatsContainer}>
        <View style={styles.priceStyle}>
          <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12 }}>
            {price}
          </Text>
        </View>
        <ArrowIcon />
        <View style={styles.progressStyle}>
          <Text
            style={{
              fontFamily: 'Inter_500Medium',
              fontSize: 12,
              color: COLORS.lightGrey
            }}
          >
            {progress}
          </Text>
        </View>

        <Text>{time}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  bottomStatsContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  priceStyle: {
    paddingRight: 14
  },
  progressStyle: {
    paddingLeft: 7,
    paddingRight: 4
  }
});
