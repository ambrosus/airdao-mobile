import React from 'react';
import { NumberInput } from './Input.number';
import { TextInput } from './Input.text';
import { InputProps } from './Input.types';

export function Input(props: InputProps): JSX.Element {
  const { type, ...restProps } = props;

  switch (type) {
    case 'number':
      return <NumberInput {...restProps} />;
    case 'text': {
      return <TextInput {...restProps} />;
    }
    default: {
      return <TextInput {...restProps} />;
    }
  }
}
