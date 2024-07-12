import React, { useMemo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import uppercase from 'lodash/upperCase';
import { Row, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';

const LIST_HEADER_TITLES = ['bonds', 'discount', 'value'];

export const ListCellHeadings = () => {
  const listHeadingsStyle: StyleProp<ViewStyle> = useMemo(() => {
    return {
      paddingHorizontal: scale(16.5),
      paddingBottom: 16
    };
  }, []);

  return (
    <Row
      alignItems="center"
      justifyContent="space-between"
      style={listHeadingsStyle}
    >
      {LIST_HEADER_TITLES.map((heading, index) => (
        <Text
          fontSize={12}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral600}
          key={index}
        >
          {uppercase(heading)}
        </Text>
      ))}
    </Row>
  );
};
