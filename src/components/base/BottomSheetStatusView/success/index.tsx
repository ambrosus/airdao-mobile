import React, { PropsWithChildren, useCallback, useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { t } from 'i18next';
import { styles } from '../styles';
import { Spacer } from '@components/base/Spacer';
import { PrimaryButton } from '@components/modular';
import { Text } from '@components/base/Text';
import { COLORS } from '@constants/colors';
import { cssShadowToNative, verticalScale } from '@utils';
import { SuccessIcon } from '@components/svg/icons/v2';

interface BottomSheetSuccessViewProps extends PropsWithChildren {
  title?: string;
  description?: string;
  buttonLabel?: string;
  onButtonPress?: () => void;
}

export const BottomSheetSuccessView = ({
  title = t('common.tx.confirmed'),
  description,
  buttonLabel = t('common.done'),
  onButtonPress,
  children
}: BottomSheetSuccessViewProps) => {
  const { bottom } = useSafeAreaInsets();
  const onSuccessButtonPress = useCallback(() => {
    return onButtonPress && onButtonPress();
  }, [onButtonPress]);

  const shadow = useMemo(
    () => cssShadowToNative('0px 0px 12px 0px rgba(53, 104, 221, 0.50)'),
    []
  );

  const containerStyle: StyleProp<ViewStyle> = useMemo(
    () => ({
      ...styles.container,
      paddingBottom: bottom
    }),
    [bottom]
  );

  return (
    <View style={containerStyle}>
      <SuccessIcon />
      <Spacer value={verticalScale(16)} />
      <Text fontSize={20} fontFamily="Inter_700Bold" color={COLORS.neutral800}>
        {title}
      </Text>
      {children ? (
        children
      ) : (
        <>
          <Spacer value={verticalScale(12)} />
          <Text
            fontSize={17}
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral500}
            style={styles.description}
            align="center"
          >
            {description}
          </Text>
          <View style={styles.footer}>
            <PrimaryButton onPress={onSuccessButtonPress} style={shadow}>
              <Text
                fontFamily="Inter_600SemiBold"
                fontSize={16}
                color={COLORS.neutral0}
              >
                {buttonLabel}
              </Text>
            </PrimaryButton>
          </View>
        </>
      )}
    </View>
  );
};
