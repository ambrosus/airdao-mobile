import React from 'react';
import { InputProps, InputRef } from './Input.types';
import { TextInput } from './Input.text';
import { COLORS } from '@constants/colors';
import { StringUtils } from '@utils';

export const NumberInput = React.forwardRef<InputRef, InputProps>(
  (props, ref) => {
    const { value, style = {}, onChangeValue, ...restProps } = props;
    const styles = [{ color: COLORS.black, padding: 0 }, style];

    const onChangeText = (text: string) => {
      if (typeof onChangeValue === 'function') {
        onChangeValue(StringUtils.formatNumberInput(text));
      }
    };

    return (
      <TextInput
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        style={styles}
        keyboardType="numeric"
        {...restProps}
      />
    );
  }
);
