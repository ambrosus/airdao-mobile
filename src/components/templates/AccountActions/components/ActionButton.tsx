import React, { useMemo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Button, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { moderateScale, verticalScale } from '@utils/scaling';
import { IconProps } from '@components/svg/icons';

export interface AccountActionButtonProps {
  Icon: React.ElementType<IconProps>;
  text: string;
  isActive?: boolean;
  onPress?: () => unknown;
}

export const AccountActionButton = (props: AccountActionButtonProps) => {
  const { Icon, text, isActive, onPress } = props;

  const iconColor = isActive ? COLORS.brand600 : COLORS.neutral500;

  const iconStyle: StyleProp<ViewStyle> = useMemo(() => {
    return [
      styles.icon,
      {
        borderColor: isActive ? COLORS.primary100 : COLORS.neutral100,
        backgroundColor: isActive ? COLORS.primary50 : COLORS.neutral50
      }
    ];
  }, [isActive]);

  return (
    <Button onPress={onPress} disabled={!isActive} style={styles.container}>
      <View style={iconStyle}>
        <Icon color={iconColor} />
      </View>
      <Spacer value={verticalScale(10)} />
      <Text fontSize={14} color={COLORS.neutral800}>
        {text}
      </Text>
    </Button>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
    borderWidth: 0.5,
    borderRadius: moderateScale(8),
    minHeight: 40,
    height: moderateScale(40),
    width: moderateScale(40)
  }
});
