import React, { Dispatch, SetStateAction, useMemo } from 'react';
import { StyleProp, ViewStyle, TouchableOpacity } from 'react-native';
import { upperFirst } from 'lodash';
import { styles } from './styles';
import { Text } from '@components/base';
import { FiltersState } from '@features/kosmos/types';
import { COLORS } from '@constants/colors';

interface FiltersItemProps {
  stateKey: keyof FiltersState;
  value: string;
  filters: FiltersState;
  updateFilters: Dispatch<SetStateAction<FiltersState>>;
}

export const FiltersItem = ({
  stateKey,
  value,
  filters,
  updateFilters
}: FiltersItemProps) => {
  const isSelected = useMemo(() => {
    return value === filters[stateKey];
  }, [value, filters, stateKey]);

  const combinedItemStyle: StyleProp<ViewStyle> = useMemo(() => {
    return {
      ...styles.itemContainer,
      borderWidth: isSelected ? 2 : 1,
      borderColor: isSelected ? COLORS.brand400 : COLORS.neutral200,
      backgroundColor: isSelected ? '#E9EFFB' : COLORS.neutral100
    };
  }, [isSelected]);

  const onFilterValuePress = () => {
    if (stateKey === 'payment' && filters.payment === value) {
      return updateFilters({ ...filters, payment: null });
    }

    return updateFilters({ ...filters, [stateKey]: value });
  };

  return (
    <TouchableOpacity onPress={onFilterValuePress} style={combinedItemStyle}>
      <Text
        fontSize={16}
        fontFamily="Inter_500Medium"
        color={isSelected ? COLORS.brand500 : COLORS.neutral800}
      >
        {upperFirst(value)}
      </Text>
    </TouchableOpacity>
  );
};
