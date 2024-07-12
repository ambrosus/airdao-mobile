import React from 'react';
import { View } from 'react-native';
import { FiltersSelector } from '@features/kosmos/components/modular';
import { Row } from '@components/base';

export const ActiveMarketsWithFilters = () => {
  return (
    <View>
      <Row style={{ columnGap: 16 }}>
        <FiltersSelector label="Filter by" />
        <FiltersSelector label="Payment token" />
      </Row>
    </View>
  );
};
