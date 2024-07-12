import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { Text } from '@components/base';
import { ChevronDownIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';

interface FiltersSelectorProps {
  label: string;
}

export const FiltersSelector = ({ label }: FiltersSelectorProps) => {
  return (
    <TouchableOpacity>
      <View style={styles.container}>
        <Text fontSize={14} fontFamily="Inter_500Medium" color={COLORS.black}>
          {label}
        </Text>

        <ChevronDownIcon color={COLORS.gray800} />
      </View>
    </TouchableOpacity>
  );
};
