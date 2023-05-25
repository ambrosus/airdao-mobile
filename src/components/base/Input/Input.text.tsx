import React, { useImperativeHandle, useRef } from 'react';
import { TextInput as RNTextInput, StyleSheet } from 'react-native';
import { InputProps, InputRef } from './Input.types';
import { shadow } from '@constants/shadow';
import { moderateScale, scale, verticalScale } from '@utils/scaling';

export const TextInput = React.forwardRef<InputRef, InputProps>(
  (props, ref) => {
    const { value, style = {}, onChangeValue, ...restProps } = props;
    const styles = [defaultStyles.container, style];
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

const defaultStyles = StyleSheet.create({
  container: {
    ...shadow,
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(82),
    color: '#000000',
    padding: 0,
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16)
  }
});
