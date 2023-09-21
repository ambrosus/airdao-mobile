import React, { ForwardedRef, forwardRef, useEffect } from 'react';
import { Dimensions } from 'react-native';
import {
  BottomSheet,
  BottomSheetProps,
  BottomSheetRef
} from '@components/composite';
import { useAppState, useForwardedRef } from '@hooks';
import { styles } from '@components/templates/PasscodeModal/styles';
import * as LocalAuthentication from 'expo-local-authentication';

interface PasscodeModalProps {
  isFaceIDEnabled: boolean;
}

export const FaceIDModal = forwardRef<
  BottomSheetRef,
  BottomSheetProps & PasscodeModalProps
>((props, ref) => {
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
  const { prevState } = useAppState();

  useEffect(() => {
    const authenticateWithFaceID = async () => {
      try {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate with Face ID',
          fallbackLabel: 'Fallback'
        });
        if (result.success) {
          localRef.current?.dismiss();
        } else {
          console.log('Authentication failed');
        }
      } catch (error) {
        console.error('Authentication error:', error);
      }
    };
    if (props.isFaceIDEnabled && prevState === 'background') {
      authenticateWithFaceID();
    }
  }, [props.isFaceIDEnabled, localRef, prevState]);

  return (
    <BottomSheet
      ref={localRef}
      containerStyle={styles.content}
      height={Dimensions.get('screen').height}
    >
      <></>
    </BottomSheet>
  );
});
