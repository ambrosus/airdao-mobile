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

  const textColor = isActive ? COLORS.neutral900 : COLORS.neutral300;
  const iconColor = isActive ? COLORS.neutral900 : COLORS.alphaBlack30;
  return (
    <Button onPress={onPress} disabled={!isActive} style={styles.container}>
      <View style={styles.icon}>
        <Icon color={iconColor} />
      </View>
      <Spacer value={verticalScale(10)} />
      <Text fontSize={14} color={textColor}>
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
    backgroundColor: COLORS.alphaBlack5,
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
    borderRadius: moderateScale(40),
    minHeight: 40,
    height: moderateScale(40),
    width: moderateScale(40)
  }
});
