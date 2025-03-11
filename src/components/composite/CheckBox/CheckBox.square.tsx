import { Button } from '@components/base';
import { CheckIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { moderateScale, scale } from '@utils';
import { SquareCheckBoxProps } from './CheckBox.types';

export const CheckBoxSquare = (props: SquareCheckBoxProps): JSX.Element => {
  const { fillColor, value, onValueChange, testID, ...iconProps } = props;
  const onPress = () => {
    if (typeof onValueChange === 'function') {
      onValueChange(!value);
    }
  };

  return (
    <Button
      testID={testID}
      type="circular"
      borderRadius={scale(4)}
      onPress={onPress}
      disabled={typeof onValueChange !== 'function'}
      style={{
        backgroundColor: value ? fillColor : 'transparent',
        borderColor: COLORS.shadowBlue,
        borderWidth: value ? 0 : 1,
        width: moderateScale(24),
        height: moderateScale(24)
      }}
    >
      {value && <CheckIcon {...iconProps} />}
    </Button>
  );
};
