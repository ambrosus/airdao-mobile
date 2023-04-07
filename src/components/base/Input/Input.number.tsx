import React, { useImperativeHandle, useRef } from 'react';
import { TextInput as RNTextInput } from 'react-native';
import { InputProps, InputRef } from './Input.types';
import { TextInput } from './Input.text';

export const NumberInput = React.forwardRef<InputRef, InputProps>(
  (props, ref) => {
    const { value, style = {}, onChangeValue } = props;
    const styles = [{ color: '#000000', padding: 0 }, style];
    const rnInputRef = useRef<RNTextInput>(null);

    useImperativeHandle(
      ref,
      () => {
        return {
          focus() {
            rnInputRef.current?.focus();
          },
          clear() {
            rnInputRef.current?.clear();
          }
        };
      },
      []
    );

    return (
      <TextInput
        ref={rnInputRef}
        value={value}
        onChangeText={onChangeValue}
        style={styles}
        keyboardType="number-pad"
      />
    );
  }
);
