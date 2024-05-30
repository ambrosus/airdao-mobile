import React from 'react';
import { TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { Row, Text } from '@components/base';

export const CurrencySelect = () => {
  return (
    <TouchableOpacity>
      <Row alignItems="center" style={styles.container}>
        <Text>Select</Text>
      </Row>
    </TouchableOpacity>
  );
};
