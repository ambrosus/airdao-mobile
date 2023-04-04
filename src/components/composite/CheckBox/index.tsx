import React from 'react';
import { CheckBoxFactoryProps } from './CheckBox.types';
import { CheckBoxSquare } from './CheckBox.square';

export const CheckBox = (props: CheckBoxFactoryProps): JSX.Element => {
  const { type, ...checkBoxProps } = props;

  // TODO implement circular CheckBox if needed
  switch (type) {
    case 'circular': {
    }
    case 'square': {
      return <CheckBoxSquare {...checkBoxProps} />;
    }
    default: {
      return <CheckBoxSquare {...checkBoxProps} />;
    }
  }
};
