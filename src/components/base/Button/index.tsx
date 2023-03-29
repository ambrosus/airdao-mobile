import React from 'react';
import { BaseButton } from './Button.Base';
import { BorderedButton } from './Button.Bordered';
import { ButtonProps } from './Button.types';

export function Button(props: ButtonProps): JSX.Element {
  const { type, ...restProps } = props;

  switch (type) {
    case 'base': {
      return <BaseButton {...restProps} />;
    }
    case 'bordered': {
      return <BorderedButton {...restProps} />;
    }
    default: {
      return <BaseButton {...restProps} />;
    }
  }
}

export * from './Button.types';
