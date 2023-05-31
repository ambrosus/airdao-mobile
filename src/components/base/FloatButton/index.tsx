import React, { memo } from 'react';
import { Pressable, StyleSheet, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@constants/colors';
import { Spacer, Text } from '@components/base';
import { moderateScale, scale, verticalScale } from '@utils/scaling';

type Props = {
  title?: string;
  titleStyle?: TextStyle;
  icon?: JSX.Element;
  onPress: () => void;
  bottomPadding?: number;
  testID?: string;
  type?: 'primary' | 'circular';
};

const DEFAULT_BOTTOM_TAB_HEIGHT = 65;

export const FloatButton = memo(
  ({
    title,
    icon,
    onPress,
    bottomPadding,
    titleStyle,
    testID = 'Float_Button',
    type = 'primary'
  }: Props) => {
    const bottomSafeArea = useSafeAreaInsets().bottom || 34;
    const bottomTabBarHeight =
      bottomPadding !== undefined ? bottomPadding : DEFAULT_BOTTOM_TAB_HEIGHT;
    return (
      <Pressable
        testID={testID}
        onPress={onPress}
        style={[
          styles.buttonStyle,
          {
            bottom: bottomTabBarHeight + bottomSafeArea,
            width: type === 'primary' ? '90%' : moderateScale(48),
            height: type === 'primary' ? 'auto' : moderateScale(48),
            alignSelf: type === 'primary' ? 'center' : 'flex-end',
            right: type === 'primary' ? undefined : scale(16)
          }
        ]}
      >
        {icon}
        {!!title && (
          <>
            <Spacer value={10.5} horizontal />
            <Text
              style={[styles.bottomButtonText, titleStyle]}
              testID="Float_Button_Title"
            >
              {title}
            </Text>
          </>
        )}
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  buttonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: COLORS.deepBlue,
    borderRadius: 1000,
    justifyContent: 'center',
    paddingVertical: verticalScale(12)
  },
  bottomButtonText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: COLORS.white
  },
  iconPadding: {
    paddingRight: 10.5
  }
});
