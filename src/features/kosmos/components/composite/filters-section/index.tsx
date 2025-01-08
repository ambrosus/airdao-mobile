import React, { Dispatch, SetStateAction } from 'react';
import { View } from 'react-native';
import { Row, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { FiltersState } from '@features/kosmos/types';
import { styles } from './styles';
import { FiltersItem } from '../../base';

interface FiltersSectionsProps {
  label: string;
  values: string[];
  filters: FiltersState;
  updateFilters: Dispatch<SetStateAction<FiltersState>>;
  stateKey: keyof FiltersState;
}

export const FiltersSections = ({
  label,
  values,
  filters,
  updateFilters,
  stateKey
}: FiltersSectionsProps) => {
  return (
    <View style={styles.container}>
      <Text
        fontSize={14}
        fontFamily="Inter_500Medium"
        color={COLORS.neutral600}
      >
        {label}
      </Text>

      {values.length && (
        <Row alignItems="center" justifyContent="space-between">
          {values.map((value) => (
            <FiltersItem
              key={value}
              stateKey={stateKey}
              value={value}
              filters={filters}
              updateFilters={updateFilters}
            />
          ))}
        </Row>
      )}
    </View>
  );
};
