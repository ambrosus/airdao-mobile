import React, { memo } from 'react';
import { Pressable, StyleSheet, TextStyle, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@constants/colors';
import { Text } from '@components/base';
import { verticalScale } from '@utils/scaling';

type Props = {
  title: string;
  titleStyle?: TextStyle;
  icon?: JSX.Element;
  onPress: () => void;
  bottomPadding?: number;
  testID?: string;
};

const DEFAULT_BOTTOM_TAB_HEIGHT = 65;

export const FloatButton = memo(
  ({
    title,
    icon,
    onPress,
    bottomPadding,
    titleStyle,
    testID = 'Float_Button'
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
            bottom: bottomTabBarHeight + bottomSafeArea
          }
        ]}
      >
        <View style={styles.iconPadding}>{icon}</View>
        <Text
          style={[styles.bottomButtonText, titleStyle]}
          testID="Float_Button_Title"
        >
          {title}
        </Text>
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  buttonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: COLORS.deepBlue,
    borderRadius: 1000,
    justifyContent: 'center',
    width: '90%',
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
