import React, { ReactNode, useRef } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  TouchableWithoutFeedback
} from 'react-native';
import { styles } from './styles';
import { Text } from '@components/base';
import { COLORS } from '@constants/colors';

interface SettingsInputWithLabelProps extends TextInputProps {
  label: string;
  children?: ReactNode;
}

export const SettingsInputWithLabel = ({
  label,
  onChangeText,
  value,
  style,
  placeholder,
  children
}: SettingsInputWithLabelProps) => {
  const inputRef = useRef<TextInput>(null);

  const onInputContainerPress = () => inputRef.current?.focus();

  return (
    <View style={styles.formWithLabel}>
      <Text
        fontSize={16}
        fontFamily="Inter_500Medium"
        color={COLORS.neutral500}
      >
        {label}
      </Text>

      <TouchableWithoutFeedback onPress={onInputContainerPress}>
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            maxLength={24}
            style={style}
            placeholder={placeholder}
            keyboardType="numeric"
            value={value}
            onChangeText={onChangeText}
          />

          {children}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};
