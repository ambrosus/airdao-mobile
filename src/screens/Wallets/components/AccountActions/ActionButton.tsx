import React from 'react';
import { StyleSheet, View } from 'react-native';
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

  const textColor = isActive ? COLORS.smokyBlack : COLORS.neutral300;
  const iconColor = textColor;
  return (
    <Button onPress={onPress} disabled={!isActive} style={styles.container}>
      <View style={styles.icon}>
        <Icon color={iconColor} />
      </View>
      <Spacer value={verticalScale(10)} />
      <Text color={textColor}>{text}</Text>
    </Button>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    backgroundColor: COLORS.smokyBlack5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(48),
    minHeight: 48,
    height: moderateScale(48),
    width: moderateScale(48)
  }
});
