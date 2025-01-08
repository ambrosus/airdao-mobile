import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from '@components/base';
import { ChevronDownIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { styles } from './styles';

interface FiltersSelectorProps {
  label: string;
  onFiltersPress: () => void;
}

export const FiltersSelector = ({
  label,
  onFiltersPress
}: FiltersSelectorProps) => {
  return (
    <TouchableOpacity onPress={onFiltersPress}>
      <View style={styles.container}>
        <Text fontSize={14} fontFamily="Inter_500Medium" color={COLORS.black}>
          {label}
        </Text>

        <ChevronDownIcon scale={0.85} color={COLORS.neutral800} />
      </View>
    </TouchableOpacity>
  );
};
