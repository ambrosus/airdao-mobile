import React, { ReactNode, useCallback, useRef } from 'react';
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

  const onChangeSlippageBlur = useCallback(() => {
    if (onChangeText && value) {
      let formattedValue = value;
      if (!value.includes('.')) {
        formattedValue = value + '.00';
      } else {
        const [integer, decimal] = value.split('.');
        if (decimal.length === 1) {
          formattedValue = `${integer}.${decimal}0`;
        }
      }
      return onChangeText(formattedValue);
    }
  }, [onChangeText, value]);

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
            onBlur={onChangeSlippageBlur}
          />

          {children}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};
