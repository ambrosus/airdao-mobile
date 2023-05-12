import React from 'react';
import { SquareCheckBoxProps } from './CheckBox.types';
import { Button } from '@components/base';
import { CheckIcon } from '@components/svg/icons';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const CheckBoxSquare = (props: SquareCheckBoxProps): JSX.Element => {
  const { fillColor, value, testID, onValueChange, ...iconProps } = props;
  const onPress = () => {
    if (typeof onValueChange === 'function') {
      onValueChange(!value);
    }
  };

  return (
    <Button
      type="circular"
      borderRadius={scale(4)}
      onPress={onPress}
      disabled={typeof onValueChange !== 'function'}
      style={{
        backgroundColor: value ? fillColor : 'transparent',
        borderColor: COLORS.shadowBlue,
        borderWidth: value ? 0 : 1,
        width: scale(24),
        height: scale(24)
      }}
      testID={testID}
    >
      {value && (
        <CheckIcon {...iconProps} testID={(testID || '') + '-square'} />
      )}
    </Button>
  );
};
