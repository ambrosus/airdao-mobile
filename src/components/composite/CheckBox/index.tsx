import React from 'react';
import { CheckBoxCircular } from './CheckBox.circular';
import { CheckBoxSquare } from './CheckBox.square';
import { CheckBoxFactoryProps } from './CheckBox.types';

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
