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
import { SwapStringUtils } from '@features/swap/utils';
import { INITIAL_SLIPPAGE_TOLERANCE } from '@features/swap/context/initials';

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
    if (typeof onChangeText === 'function') {
      const newValue = SwapStringUtils.transformSlippageOnBlur(value);
      return onChangeText(newValue ?? INITIAL_SLIPPAGE_TOLERANCE);
    }
  }, [onChangeText, value]);

  return (
    <View style={styles.formWithLabel}>
      <Text
        fontSize={14}
        fontFamily="Inter_500Medium"
        color={COLORS.neutral800}
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
