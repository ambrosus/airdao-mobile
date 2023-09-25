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
  biometricType?: string | null;
}

export const FaceIDModal = forwardRef<
  BottomSheetRef,
  BottomSheetProps & PasscodeModalProps
>((props, ref) => {
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
  const { prevState } = useAppState();

  useEffect(() => {
    const authenticateWithBiometric = async () => {
      try {
        // let promptMessage = 'Authenticate with Biometric';
        // if (props.biometricType === 'Face ID') {
        //   promptMessage = 'Authenticate with Face ID';
        // } else if (props.biometricType === 'Fingerprint, IRIS or etc') {
        //   promptMessage = 'Authenticate with Fingerprint';
        // }

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
      authenticateWithBiometric();
    }
    if (props.isFaceIDEnabled && prevState === null) {
      setTimeout(() => {
        authenticateWithBiometric();
      }, 1200);
    }
  }, [props.isFaceIDEnabled, localRef, prevState, props.biometricType]);

  return (
    <BottomSheet
      ref={localRef}
      containerStyle={styles.content}
      height={Dimensions.get('screen').height}
    >
      <></>
      {/*<Text>Biometric modal rendered</Text>*/}
    </BottomSheet>
  );
});
