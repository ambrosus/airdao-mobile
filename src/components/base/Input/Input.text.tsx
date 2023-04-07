import React, { useImperativeHandle, useRef } from 'react';
import { TextInput as RNTextInput } from 'react-native';
import { InputProps, InputRef } from './Input.types';

export const TextInput = React.forwardRef<InputRef, InputProps>(
  (props, ref) => {
    const { value, style = {}, onChangeValue, ...restProps } = props;
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
          },
          setText(text: string) {
            rnInputRef.current?.setNativeProps({ text });
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
        {...restProps}
      />
    );
  }
);
