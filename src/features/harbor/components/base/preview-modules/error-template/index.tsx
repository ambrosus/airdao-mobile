import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Spacer, Text } from '@components/base';
import { PrimaryButton } from '@components/modular';
import { ErrorIcon } from '@components/svg/icons/v2/harbor';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';
import { styles } from './styles';

interface PreviewFormModel {
  onClose: () => void;
  onTryAgain: () => void;
}

export const ErrorTemplate = ({ onClose }: PreviewFormModel) => {
  const { t } = useTranslation();

  return (
    <>
      <View style={{ alignItems: 'center' }}>
        <ErrorIcon />
        <Spacer value={scale(12)} />
        <Text
          color={COLORS.neutral900}
          fontSize={scale(24)}
          fontFamily="Inter_700Bold"
        >
          {t('common.status.failed')}
        </Text>
        <Spacer value={scale(8)} />
        <Text fontSize={14} color={COLORS.neutral900}>
          {t('harbor.transaction.failed')}
        </Text>
      </View>
      <PrimaryButton onPress={onClose}>
        <Text style={styles.tryAgainBtn}>{t('common.try.again')}</Text>
      </PrimaryButton>
      <Spacer value={scale(12)} />
    </>
  );
};
