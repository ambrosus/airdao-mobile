import React, { forwardRef } from 'react';
import { InputProps } from '@components/base/Input';
import { Input, InputRef, Row, Spacer } from '@components/base';
import { styles } from './styles';
import { scale } from '@utils/scaling';
import { View } from 'react-native';

interface InputWithIconProps extends InputProps {
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const InputWithIcon = forwardRef<InputRef, InputWithIconProps>(
  (props, ref) => {
    const { iconLeft, iconRight, style, ...restProps } = props;

    return (
      <Row style={styles.container} alignItems="center">
        {iconLeft}
        <Spacer horizontal value={scale(14.75)} />
        <Input ref={ref} style={[style, styles.input]} {...restProps} />
        <Spacer horizontal value={scale(14.75)} />
        <View style={{ position: 'absolute', right: scale(17.75) }}>
          {iconRight}
        </View>
      </Row>
    );
  }
);
