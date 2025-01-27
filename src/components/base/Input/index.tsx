import { forwardRef } from 'react';
import { NumberInput } from './Input.number';
import { TextInput } from './Input.text';
import { InputProps, InputRef } from './Input.types';

export const Input = forwardRef<InputRef, InputProps>((props, ref) => {
  const { type, ...restProps } = props;

  switch (type) {
    case 'number':
      return <NumberInput ref={ref} {...restProps} />;
    case 'text': {
      return <TextInput ref={ref} {...restProps} />;
    }
    default: {
      return <TextInput ref={ref} {...restProps} />;
    }
  }
});

export * from './Input.types';
