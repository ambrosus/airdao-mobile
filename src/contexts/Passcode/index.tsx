import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { View } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useTranslation } from 'react-i18next';
import { Toast, ToastPosition, ToastType } from '@components/modular';
import { PasscodeUtils } from '@utils/passcode';
import { DeviceUtils } from '@utils/device';
import { useSupportedBiometrics } from '@hooks';
import { Cache, CacheKey } from '@lib/cache';

interface IPasscodeContext {
  isFaceIDEnabled: boolean;
  isPasscodeEnabled: boolean;
  loading: boolean;
  setSavedPasscode: (newPasscode: string[]) => Promise<void>;
  savedPasscode: string[];
  toggleBiometricAuthentication: () => unknown;
}

const PasscodeContext = createContext<IPasscodeContext | undefined>(undefined);

export const PasscodeProvider: FC<{ children: React.ReactNode }> = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [isFaceIDEnabled, setIsFaceIDEnabled] = useState<boolean>(false);
  const [isPasscodeEnabled, setIsPasscodeEnabled] = useState<boolean>(false);
  const [savedPasscode, setSavedPasscode] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const supportedBiometrics = useSupportedBiometrics();
  const { t } = useTranslation();

  useEffect(() => {
    Promise.all([
      PasscodeUtils.getPasscodeFromDB(),
      PasscodeUtils.getFaceIDStatusFromDB()
    ])
      .then(([passcodeRes, faceIDRes]) => {
        setIsPasscodeEnabled(passcodeRes?.length > 0);
        setIsFaceIDEnabled(faceIDRes);
        setSavedPasscode(passcodeRes as string[]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // useEffect(() => {
  //   if (savedPasscode?.length === 4) {
  //     PasscodeUtils.setPasscodeInDB(savedPasscode);
  //     setIsPasscodeEnabled(true);
  //   }
  // }, [savedPasscode]);

  const changePasscode = async (passcode: string[]) => {
    try {
      await Cache.setItem(CacheKey.isSetupSecurityInProgress, true);
      await PasscodeUtils.setPasscodeInDB(passcode);
      setIsPasscodeEnabled(true);
    } catch (error) {
      // ignore
    } finally {
      await Cache.setItem(CacheKey.isSetupSecurityInProgress, false);
    }
  };

  const toggleBiometricAuthentication = useCallback(async () => {
    try {
      await Cache.setItem(CacheKey.isSetupSecurityInProgress, true);
      if (isFaceIDEnabled) {
        await PasscodeUtils.setFaceIDStatusInDB(false);
        setIsFaceIDEnabled(false);
      } else {
        // check if device has biometric hardware
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        // device has registered biometrics data, either fingerprint or face id
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        const hasFaceId = DeviceUtils.checkFaceIDExists(supportedBiometrics);
        const hasFingerprint =
          DeviceUtils.checkFingerprintExists(supportedBiometrics);

        if (hasHardware && isEnrolled) {
          // authenticate with biometrics
          const result = await LocalAuthentication.authenticateAsync({
            promptMessage: hasFaceId
              ? t('security.authenticate.with.face.id')
              : hasFingerprint
              ? t('security.authenticate.with.fingerprint')
              : 'Authenticate',
            fallbackLabel: t('security.enter.pin')
          });
          if (result.success) {
            await PasscodeUtils.setFaceIDStatusInDB(true);
            setIsFaceIDEnabled(true);
          }
        } else {
          // show error otherwise
          Toast.show({
            text: hasFaceId
              ? t('settings.security.face.id.not.available')
              : t('settings.security.fingerprint.not.available'),
            position: ToastPosition.Top,
            type: ToastType.Failed
          });
        }
      }
    } catch (error) {
      console.error('Face ID error:', error);
    } finally {
      await Cache.setItem(CacheKey.isSetupSecurityInProgress, false);
      await Cache.setItem(CacheKey.isBiometricAuthenticationInProgress, false);
    }
  }, [isFaceIDEnabled, supportedBiometrics, t]);

  return (
    <PasscodeContext.Provider
      value={{
        isPasscodeEnabled,
        isFaceIDEnabled,
        savedPasscode,
        loading,
        toggleBiometricAuthentication,
        setSavedPasscode: changePasscode
      }}
    >
      <View style={{ flex: 1 }}>{children}</View>
    </PasscodeContext.Provider>
  );
};

export default function usePasscode() {
  const context = useContext(PasscodeContext);
  if (!context) {
    throw new Error();
  }
  return context;
}
