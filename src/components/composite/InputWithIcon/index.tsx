import { ReactNode, forwardRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  TextInputFocusEventData,
  View,
  ViewProps
} from 'react-native';
import { Input, InputRef, Spacer } from '@components/base';
import { InputProps } from '@components/base/Input';
import { scale } from '@utils';
import { styles } from './styles';

interface InputWithIconProps extends InputProps {
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  spacingLeft?: number;
  spacingRight?: number;
  containerStyle?: {
    focused?: ViewProps['style'];
    blurred?: ViewProps['style'];
  };
}

export const InputWithIcon = forwardRef<InputRef, InputWithIconProps>(
  (props, ref) => {
    const {
      iconLeft,
      iconRight,
      style,
      spacingLeft = scale(16),
      spacingRight = scale(16),
      containerStyle = {
        focused: {},
        blurred: {}
      },
      onFocus,
      onBlur,
      ...restProps
    } = props;
    const [focused, setFocused] = useState(false);
    const containerStyles = {
      ...styles.container,
      ...(focused
        ? // eslint-disable-next-line @typescript-eslint/ban-types
          { ...styles.focusedStyle, ...(containerStyle.focused as {}) }
        : // eslint-disable-next-line @typescript-eslint/ban-types
          { ...(containerStyle.blurred as {}) })
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
      <View
        style={{
          ...containerStyles,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative'
        }}
      >
        <View style={{ ...styles.iconWrapper, left: 10 }}>{iconLeft}</View>
        <Spacer horizontal value={spacingLeft} />
        <Input
          ref={ref}
          style={[styles.input, style]}
          {...restProps}
          onFocus={_onFocus}
          onBlur={_onBlur}
        />
        <Spacer horizontal value={spacingRight} />
        <View style={{ ...styles.iconWrapper, right: 10 }}>{iconRight}</View>
      </View>
    );
  }
);
