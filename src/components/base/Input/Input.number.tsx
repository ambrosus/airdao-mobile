import React from 'react';
import { InputProps, InputRef } from './Input.types';
import { TextInput } from './Input.text';

export const NumberInput = React.forwardRef<InputRef, InputProps>(
  (props, ref) => {
    const { value, style = {}, onChangeValue, ...restProps } = props;
    const styles = [{ color: '#000000', padding: 0 }, style];

    return (
      <TextInput
        ref={ref}
        value={value}
        onChangeText={onChangeValue}
        style={styles}
        {...restProps}
        keyboardType="number-pad"
        {...restProps}
      />
    );
  }
);
