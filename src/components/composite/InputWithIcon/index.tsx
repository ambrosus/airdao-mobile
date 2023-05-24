import React, { forwardRef } from 'react';
import { InputProps } from '@components/base/Input';
import { Input, InputRef, Row, Spacer } from '@components/base';
import { scale } from '@utils/scaling';
import { styles } from './styles';

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
        {iconRight}
      </Row>
    );
  }
);
