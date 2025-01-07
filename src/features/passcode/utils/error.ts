import { Linking } from 'react-native';
import { t } from 'i18next';
import { Toast, ToastPosition, ToastType } from '@components/modular';

interface ErrorArgs {
  readonly hasFaceId: boolean;
  readonly hasFingerprint: boolean;
  readonly supportedBiometricsLength: number;
}

export function _error({
  hasFaceId,
  hasFingerprint,
  supportedBiometricsLength
}: ErrorArgs) {
  const { errorText, errorSubtext, onBodyPress } = getErrorDetails({
    hasFaceId,
    hasFingerprint,
    supportedBiometricsLength
  });

  Toast.show({
    text: errorText,
    subtext: errorSubtext,
    position: ToastPosition.Top,
    onBodyPress,
    type: ToastType.Failed
  });
}

function getErrorDetails({
  hasFaceId,
  hasFingerprint,
  supportedBiometricsLength
}: ErrorArgs) {
  let errorText = '';
  let errorSubtext = undefined;
  let onBodyPress = undefined;

  if (hasFaceId) {
    errorText = t('settings.security.face.id.not.accessible');
    errorSubtext = t('settings.security.press.to.open.settings');
    onBodyPress = () => Linking.openSettings();
  } else if (hasFingerprint) {
    errorText = t('settings.security.fingerprint.not.accessible');
    errorSubtext = t('settings.security.press.to.open.settings');
    onBodyPress = () => Linking.openSettings();
  } else if (supportedBiometricsLength === 0) {
    errorText = t('settings.security.no.biometrics.available');
  }

  return { errorText, errorSubtext, onBodyPress };
}
