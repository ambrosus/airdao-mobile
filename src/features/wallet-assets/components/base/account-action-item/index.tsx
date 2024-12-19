import React, { ReactNode } from 'react';
import { Pressable } from 'react-native';
import { Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { styles } from './styles';

interface AccountActionItemProps {
  action: () => void;
  label: string;
  icon: ReactNode;
}

export const AccountActionItem = ({
  action,
  label,
  icon
}: AccountActionItemProps) => {
  return (
    <Pressable
      onPress={action}
      style={({ pressed }) => [
        styles.container,
        { opacity: pressed ? 0.5 : 1 }
      ]}
    >
      {icon}
      <Text
        fontSize={13}
        fontFamily="Inter_600SemiBold"
        color={COLORS.brand600}
      >
        {label}
      </Text>
    </Pressable>
  );
};
