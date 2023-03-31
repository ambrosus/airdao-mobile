import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Row, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { shadow } from '@constants/shadow';
import { ChevronRightIcon } from '@components/svg/icons';
import { CircularLogo } from '@components/composite';

export function LearnAboutAirDAO(): JSX.Element {
  return (
    <Button style={styles.container}>
      <Row justifyContent="space-between" alignItems="center">
        <Row alignItems="center">
          <CircularLogo />
          <Text fontWeight="600" fontSize={17} color={COLORS.black}>
            Learn about AirDAO
          </Text>
        </Row>
        <ChevronRightIcon color={COLORS.black} />
      </Row>
    </Button>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F2F2',
    paddingVertical: verticalScale(24),
    paddingHorizontal: scale(15),
    ...shadow,
    borderRadius: scale(16),
    borderColor: '#F2F2F2'
  }
});
