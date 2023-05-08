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
}

export const BottomSheetWithHeader = forwardRef<
  BottomSheetRef,
  BottomSheetWithHeaderProps
>((props, ref) => {
  const { title, actionTitle, onActionPress, children, ...bottomSheetProps } =
    props;

  const localRef = useForwardedRef<BottomSheetRef>(ref);

  const dismiss = () => {
    localRef.current?.dismiss();
  };

  const renderContentRight = () => {
    if (actionTitle) {
      return (
        <Button onPress={onActionPress}>
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
            <Button onPress={dismiss}>
              <CloseIcon />
            </Button>
          }
          contentRight={renderContentRight()}
          titleStyle={styles.headerTitle}
          title={title}
        />
        {children}
      </>
    </BottomSheet>
  );
});
