import React, { useImperativeHandle, useRef } from 'react';
import { TextInput as RNTextInput } from 'react-native';
import { InputProps, InputRef } from './Input.types';

export const NumberInput = React.forwardRef<InputRef, InputProps>(
  (props, ref) => {
    const { value, style = {}, onChangeValue } = props;
    const styles = [style, { color: '#000000' }];
    const rnInputRef = useRef<RNTextInput>(null);

    useImperativeHandle(
      ref,
      () => {
        return {
          focus() {
            rnInputRef.current?.focus();
          }
        };
      },
      []
    );

    return (
      <RNTextInput
        ref={rnInputRef}
        value={value}
        onChangeText={onChangeValue}
        style={styles}
        keyboardType="number-pad"
      />
    );
  }
);
