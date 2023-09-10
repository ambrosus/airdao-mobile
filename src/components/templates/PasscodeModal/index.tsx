import React, { ForwardedRef, forwardRef, useEffect, useState } from 'react';
import { Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { Dimensions, Modal, ModalProps, View } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { Passcode } from '@components/base/Passcode/Passcode';
import { useForwardedRef } from '@hooks';
import { database } from '@database/main';
import {
  BottomSheet,
  BottomSheetProps,
  BottomSheetRef
} from '@components/composite';

export const PasscodeModal = () => {
  // = forwardRef<BottomSheetRef, BottomSheetProps>(
  // (props, ref) => {
  //   const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
  const [isFaceIDEnabled, setIsFaceIDEnabled] = useState<boolean>(false);

  useEffect(() => {
    const authenticate = async () => {
      try {
        const { success } = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate with Face ID'
        });
        return success;
      } catch (error) {
        console.error('Authentication error:', error);
        return false;
      }
    };
    authenticate();
  }, []);

  useEffect(() => {
    (async () => {
      const storedFaceID = await database.localStorage.get('FaceID');
      setIsFaceIDEnabled(storedFaceID === 'false' || storedFaceID === 'true');
    })();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white
      }}
    >
      <Text align="center" style={{ paddingTop: 200 }}>
        FaceID or Passcode
      </Text>
      {isFaceIDEnabled && <Passcode onPasscodeChange={() => null} />}
    </View>
  );
};
