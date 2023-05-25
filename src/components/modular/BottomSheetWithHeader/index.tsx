import React, { forwardRef } from 'react';
import { Platform } from 'react-native';
import {
  BottomSheet,
  BottomSheetProps,
  BottomSheetRef,
  Header
} from '@components/composite';
import { CloseIcon } from '@components/svg/icons';
import { Button, Spacer, Text } from '@components/base';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';
import { styles } from './styles';

interface BottomSheetWithHeaderProps extends BottomSheetProps {
  title: string;
  actionTitle?: string;
  onActionPress?: () => unknown;
  actionButtonTestID?: string;
  closeVisible?: boolean;
}

export const BottomSheetWithHeader = forwardRef<
  BottomSheetRef,
  BottomSheetWithHeaderProps
>((props, ref) => {
  const {
    title,
    actionTitle,
    onActionPress,
    children,
    actionButtonTestID,
    closeVisible = false,
    ...bottomSheetProps
  } = props;

  const localRef = useForwardedRef<BottomSheetRef>(ref);

  const dismiss = () => {
    localRef.current?.dismiss();
  };

  const renderContentRight = () => {
    if (actionTitle) {
      return (
        <Button onPress={onActionPress} testID={actionButtonTestID}>
          <Text color={COLORS.jungleGreen}>{actionTitle}</Text>
        </Button>
      );
    }
  };

  return (
    <BottomSheet ref={localRef} {...bottomSheetProps}>
      <>
        {Platform.OS === 'android' && <Spacer value={scale(57)} />}
        <Header
          style={styles.header}
          backIconVisible={false}
          contentLeft={
            closeVisible && (
              <Button
                onPress={dismiss}
                testID="bottom-sheet-with-header-close-icon"
              >
                <CloseIcon />
              </Button>
            )
          }
          contentRight={renderContentRight()}
          titleStyle={styles.headerTitle}
          title={
            <Text
              fontSize={18}
              fontFamily="Inter_700Bold"
              color={COLORS.jetBlack}
            >
              {title}
            </Text>
          }
        />
        {children}
      </>
    </BottomSheet>
  );
});
