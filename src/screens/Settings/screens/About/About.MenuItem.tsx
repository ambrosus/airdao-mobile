import React from 'react';
import { Row, Text } from '@components/base';
import { ChevronDownIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { styles } from './styles';

export const AboutMenutItem = (props: { title: string }) => {
  return (
    <Row
      alignItems="center"
      justifyContent="space-between"
      style={styles.menuItem}
    >
      <Text
        color={COLORS.neutral500}
        fontSize={16}
        fontFamily="Inter_600SemiBold"
      >
        {props.title}
      </Text>
      <ChevronDownIcon rotate="270deg" color={COLORS.neutral300} />
    </Row>
  );
};
