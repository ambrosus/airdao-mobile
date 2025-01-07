import * as LocalAuthentication from 'expo-local-authentication';
import { t } from 'i18next';
import { DeviceUtils } from '@utils';

interface AuthenticateNativePopupArgs {
  readonly hasFaceId: boolean;
  readonly hasFingerprint: boolean;
}

export async function authenticateNativePopup({
  hasFaceId,
  hasFingerprint
}: AuthenticateNativePopupArgs) {
  return await LocalAuthentication.authenticateAsync({
    promptMessage: hasFaceId
      ? t('security.authenticate.with.face.id')
      : hasFingerprint
      ? t('security.authenticate.with.fingerprint')
      : 'Authenticate',
    fallbackLabel: t('security.enter.pin'),
    disableDeviceFallback: DeviceUtils.isIOS,
    cancelLabel: t('button.use.pin')
  });
}
