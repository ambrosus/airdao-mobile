import React from 'react';
import { CheckBoxFactoryProps } from './CheckBox.types';
import { CheckBoxSquare } from './CheckBox.square';
import { CheckBoxCircular } from './CheckBox.circular';

export const CheckBox = (props: CheckBoxFactoryProps): JSX.Element => {
  const { type, ...checkBoxProps } = props;

  switch (type) {
    case 'circular': {
      return <CheckBoxCircular {...checkBoxProps} />;
    }
    case 'square': {
      return <CheckBoxSquare {...checkBoxProps} />;
    }
    default: {
      return <CheckBoxSquare {...checkBoxProps} />;
    }
  }
};
