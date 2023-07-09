import React, { forwardRef, useState } from 'react';
import { InputProps } from '@components/base/Input';
import { Input, InputRef, Row, Spacer } from '@components/base';
import { scale } from '@utils/scaling';
import { styles } from './styles';
import { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';

interface InputWithIconProps extends InputProps {
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  focusedContainerStyle?: InputProps['focusedStyles'];
}

export const InputWithIcon = forwardRef<InputRef, InputWithIconProps>(
  (props, ref) => {
    const {
      iconLeft,
      iconRight,
      focusedContainerStyle = {},
      style,
      onFocus,
      onBlur,
      ...restProps
    } = props;
    const [focused, setFocused] = useState(false);
    const containerStyles = {
      ...styles.container,
      ...(focused
        ? // eslint-disable-next-line @typescript-eslint/ban-types
          { ...styles.focusedStyle, ...(focusedContainerStyle as {}) }
        : {})
    };

    const _onFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      if (typeof onFocus === 'function') onFocus(e);
      setFocused(true);
    };

    const _onBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      if (typeof onBlur === 'function') onBlur(e);
      setFocused(false);
    };

    return (
      <Row style={containerStyles} alignItems="center">
        {iconLeft}
        <Spacer horizontal value={scale(16)} />
        <Input
          ref={ref}
          style={[style, styles.input]}
          {...restProps}
          onFocus={_onFocus}
          onBlur={_onBlur}
        />
        <Spacer horizontal value={scale(16)} />
        {iconRight}
      </Row>
    );
  }
);
