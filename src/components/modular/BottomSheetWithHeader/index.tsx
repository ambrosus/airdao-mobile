import React, { forwardRef } from 'react';
import {
  BottomSheet,
  BottomSheetProps,
  BottomSheetRef,
  Header
} from '@components/composite';
import { CloseIcon } from '@components/svg/icons';
import { Button, Text } from '@components/base';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { COLORS } from '@constants/colors';
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
        <Header
          style={styles.header}
          backIconVisible={false}
          contentLeft={
            closeVisible && (
              <Button onPress={dismiss}>
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
