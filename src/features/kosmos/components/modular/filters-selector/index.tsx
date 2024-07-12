import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { Text } from '@components/base';
import { ChevronDownIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';

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

        <ChevronDownIcon color={COLORS.gray800} />
      </View>
    </TouchableOpacity>
  );
};
