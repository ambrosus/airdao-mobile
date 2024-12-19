import React, { useImperativeHandle, useRef, useState } from 'react';
import { TextInput as RNTextInput, StyleSheet } from 'react-native';
import { InputProps, InputRef } from './Input.types';
import { moderateScale, scale, verticalScale } from '@utils';
import { COLORS } from '@constants/colors';

export const TextInput = React.forwardRef<InputRef, InputProps>(
  (props, ref) => {
    const { value, style = {}, onChangeValue, ...restProps } = props;
    const rnInputRef = useRef<RNTextInput>(null);
    const [focused, setFocused] = useState(false);
    const styles = [
      defaultStyles.container,
      style,
      focused ? [defaultStyles.focusedStyle, [props.focusedStyles]] : {}
    ];

    useImperativeHandle(
      ref,
      () => {
        return {
          focus() {
            rnInputRef.current?.focus();
          },
          blur() {
            rnInputRef.current?.blur();
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
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...restProps}
      />
    );
  }
);

const defaultStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.neutral0,
    borderRadius: moderateScale(82),
    color: COLORS.black,
    padding: 0,
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    borderWidth: 1,
    borderColor: COLORS.alphaBlack10
  },
  focusedStyle: {
    borderColor: COLORS.brand300
  }
});
