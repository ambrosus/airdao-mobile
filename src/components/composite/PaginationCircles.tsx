import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Row } from '@components/base';

interface PaginationCirclesProps {
  totalCount: number;
  activeIndex: number;
  activeColor: string;
  passiveColor: string;
  size: number;
  gap: number;
}

export const PaginationCircles = (props: PaginationCirclesProps) => {
  const { activeColor, passiveColor, size, activeIndex, gap, totalCount } =
    props;

  const renderCircle = (_: any, index: number) => {
    const isActive = index === activeIndex;
    const bgColor = isActive ? activeColor : passiveColor;
    return (
      <View
        key={index}
        style={[
          styles.circle,
          { width: size, height: size, backgroundColor: bgColor }
        ]}
      />
    );
  };

  return (
    <Row style={{ columnGap: gap }} alignItems="center">
      {new Array(totalCount).fill(0).map(renderCircle)}
    </Row>
  );
};

const styles = StyleSheet.create({
  circle: {
    borderRadius: 1000
  }
});
