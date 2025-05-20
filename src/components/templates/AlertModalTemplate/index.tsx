import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Row, Text } from '@components/base';
import { PrimaryButton, SecondaryButton } from '@components/modular';
import { InfoIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';
import { styles } from './styles';

interface AlertModalProps {
  title?: string;
  subTitle?: string;
  buttonsLabels?: string[];
  onApprove: () => void;
  onReject: () => void;
  buttonLabels?: string[];
}

export const AlertModalTemplate = ({
  title = '',
  subTitle = '',
  buttonsLabels = ['', ''],
  onApprove,
  onReject
}: AlertModalProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <InfoIcon scale={0.8} />
      </View>
      <Text
        fontSize={scale(20)}
        fontFamily="Inter_700Bold"
        color={COLORS.neutral800}
        align="center"
      >
        {title || t('bridge.transaction.confirmations')}
      </Text>
      {!!subTitle && (
        <Text
          fontSize={15}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral800}
          align="center"
        >
          {subTitle}
        </Text>
      )}
      <Row width="100%" justifyContent={'space-around'}>
        {buttonsLabels?.[0] && (
          <SecondaryButton style={styles.reject} onPress={onReject}>
            <Text color={COLORS.brand600}>
              {buttonsLabels?.[0] || t('button.cancel')}
            </Text>
          </SecondaryButton>
        )}
        {buttonsLabels?.[1] && (
          <PrimaryButton style={styles.approve} onPress={onApprove}>
            <Text color={COLORS.neutral0}>
              {buttonsLabels?.[1] || t('button.processed')}
            </Text>
          </PrimaryButton>
        )}
      </Row>
    </View>
  );
};
