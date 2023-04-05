import React, { forwardRef } from 'react';
import { InputProps } from '@components/base/Input';
import { Input, InputRef, Row } from '@components/base';
import { styles } from './styles';

interface InputWithIconProps extends InputProps {
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const InputWithIconProps = forwardRef<InputRef, InputWithIconProps>(
  (props, ref) => {
    const { iconLeft, iconRight, ...restProps } = props;

    return (
      <Row style={styles.container}>
        {iconLeft}
        <Input ref={ref} {...restProps} />;{iconRight}
      </Row>
    );
  }
);
