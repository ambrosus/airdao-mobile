import React from 'react';
import { InputProps, InputRef } from './Input.types';
import { TextInput } from './Input.text';
import { COLORS } from '@constants/colors';

export const NumberInput = React.forwardRef<InputRef, InputProps>(
  (props, ref) => {
    const { value, style = {}, onChangeValue, ...restProps } = props;
    const styles = [{ color: COLORS.black, padding: 0 }, style];

    return (
      <TextInput
        ref={ref}
        value={value}
        onChangeText={onChangeValue}
        style={styles}
        keyboardType="number-pad"
        {...restProps}
      />
    );
  }
);
