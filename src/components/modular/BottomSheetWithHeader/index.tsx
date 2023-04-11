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
          <Text color="#2F2B43" opacity={0.5}>
            {actionTitle}
          </Text>
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
            <Button onPress={dismiss}>
              <CloseIcon />
            </Button>
          }
          contentRight={renderContentRight()}
          title={title}
        />
        {children}
      </>
    </BottomSheet>
  );
});
