import { useCallback } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { authenticateNativePopup, usePasscodeStore } from '@features/passcode';
import { Cache, CacheKey } from '@lib/cache';
import { DeviceUtils, PasscodeUtils } from '@utils';

export function usePasscodeActions() {
  const {
    isFaceIDEnabled,
    onChangePasscode,
    onChangeIsFaceIDEnabled,
    onChangeIsPasscodeEnabled
  } = usePasscodeStore();

  const onChangePasscodeHandle = useCallback(
    async (passcode: string[]) => {
      try {
        await PasscodeUtils.setPasscodeInDB(passcode);
        onChangePasscode(passcode);
      } catch (error) {
        onChangeIsPasscodeEnabled(false);
        throw error;
      }
    },
    [onChangeIsPasscodeEnabled, onChangePasscode]
  );

  const onToggleBiometricAuth = useCallback(async () => {
    try {
      if (isFaceIDEnabled) {
        await PasscodeUtils.setFaceIDStatusInDB(false);
        onChangeIsFaceIDEnabled(false);
      } else {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        const hasFaceId = await DeviceUtils.checkFaceIDExists();
        const hasFingerprint = await DeviceUtils.checkFingerprintExists();

        if (hasHardware && isEnrolled) {
          await Cache.setItem(
            CacheKey.isBiometricAuthenticationInProgress,
            true
          );

          const result = await authenticateNativePopup({
            hasFaceId,
            hasFingerprint
          });

          if (result.success) {
            await PasscodeUtils.setFaceIDStatusInDB(true);
            onChangeIsFaceIDEnabled(true);
          } else {
            return;
            // block errors for biometric
            // _error({
            //   hasFaceId,
            //   hasFingerprint,
            //   supportedBiometricsLength: toLength(supportedBiometrics)
            // });
          }
        }
      }
    } catch (error) {
      console.error('Face ID error:', error);
      throw error;
    }
  }, [isFaceIDEnabled, onChangeIsFaceIDEnabled]);

  return { onChangePasscodeHandle, onToggleBiometricAuth };
}
