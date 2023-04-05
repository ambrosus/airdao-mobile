import { Row, Spacer, Text } from '@components/base';
import { NumberUtils } from '@utils/number';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface TotalAdressesProps {
  addressCount: number;
  holderCount: number;
}

export const TotalAdresses = (props: TotalAdressesProps): JSX.Element => {
  const { addressCount, holderCount } = props;

  return (
    <Row
      justifyContent="space-between"
      alignItems="center"
      style={styles.container}
    >
      <View>
        <Text fontWeight="400" fontSize={12} color="#828282">
          Total Addresses
        </Text>
        <Spacer value={verticalScale(3)} />
        <Text fontFamily="Mersad_600SemiBold" fontSize={19}>
          {NumberUtils.formatNumber(addressCount, 0)}
        </Text>
      </View>
      <View>
        <Text fontWeight="400" fontSize={12} color="#828282">
          Total Holders
        </Text>
        <Spacer value={verticalScale(3)} />
        <Text fontFamily="Mersad_600SemiBold" fontSize={19}>
          {NumberUtils.formatNumber(holderCount, 0)}
        </Text>
      </View>
    </Row>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#F2F2F2',
    borderWidth: 1,
    borderColor: '#2f2b431a',
    paddingHorizontal: scale(40),
    paddingVertical: verticalScale(20),
    borderRadius: moderateScale(12)
  }
});
