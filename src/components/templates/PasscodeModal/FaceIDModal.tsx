import React, { ForwardedRef, forwardRef, useEffect, useState } from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import {
  BottomSheet,
  BottomSheetProps,
  BottomSheetRef
} from '@components/composite';
import { useForwardedRef } from '@hooks';
import { styles } from '@components/templates/PasscodeModal/styles';
import * as LocalAuthentication from 'expo-local-authentication';
import { Text } from '@components/base';

interface PasscodeModalProps {
  isFaceIDEnabled: boolean;
}

export const FaceIDModal = forwardRef<
  BottomSheetRef,
  BottomSheetProps & PasscodeModalProps
>((props, ref) => {
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleAuthentication = async () => {
    setIsAuthenticating(true);
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
    } finally {
      setIsAuthenticating(false);
    }
  };

  // TODO comment out to see the bug when modal is not closed after face id success
  // useEffect(() => {
  //   const authenticateWithFaceID = async () => {
  //     try {
  //       const result = await LocalAuthentication.authenticateAsync({
  //         promptMessage: 'Authenticate with Face ID',
  //         fallbackLabel: 'Fallback'
  //       });
  //       if (result.success) {
  //         localRef.current?.dismiss();
  //       } else {
  //         console.log('Authentication failed');
  //       }
  //     } catch (error) {
  //       console.error('Authentication error:', error);
  //     }
  //   };
  //
  //   if (props.isFaceIDEnabled) {
  //     authenticateWithFaceID();
  //   }
  // }, [props.isFaceIDEnabled, localRef]);

  return (
    <BottomSheet
      ref={localRef}
      containerStyle={styles.content}
      height={Dimensions.get('screen').height}
    >
      {/* Comment out to see without button */}
      <View style={styles.container}>
        {props.isFaceIDEnabled && (
          <TouchableOpacity
            onPress={handleAuthentication}
            disabled={isAuthenticating}
          >
            <Text>Authenticate with Face ID</Text>
          </TouchableOpacity>
        )}
      </View>
    </BottomSheet>
  );
});
