import { View } from 'react-native';
import { Button } from '@components/base';
import { COLORS } from '@constants/colors';
import { moderateScale } from '@utils';
import { CircularCheckBoxProps } from './CheckBox.types';

export const CheckBoxCircular = (props: CircularCheckBoxProps): JSX.Element => {
  const {
    size = 24,
    fillColor,
    value,
    onValueChange,
    testID,
    ...restProps
  } = props;
  const innerCircleSize = size / 3;
  const onPress = () => {
    if (typeof onValueChange === 'function') {
      onValueChange(!value);
    }
  };

  return (
    <Button
      testID={testID}
      disabled={typeof onValueChange !== 'function'}
      type="circular"
      borderRadius={moderateScale(size / 2)}
      onPress={onPress}
      style={{
        backgroundColor: value ? fillColor : 'transparent',
        borderColor: value ? 'transparent' : fillColor,
        borderWidth: value ? 0 : 1,
        width: moderateScale(size),
        height: moderateScale(size)
      }}
      {...restProps}
    >
      <View
        style={{
          borderRadius: moderateScale(innerCircleSize / 2),
          width: moderateScale(innerCircleSize),
          height: moderateScale(innerCircleSize),
          backgroundColor: value ? COLORS.neutral0 : 'transparent'
        }}
      />
    </Button>
  );
};
