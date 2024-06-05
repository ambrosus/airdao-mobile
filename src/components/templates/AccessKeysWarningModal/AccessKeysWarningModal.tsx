import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { Button, Text } from '@components/base';
import { CloseIcon, LeadEyeIcon, WarningIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { SecondaryButton } from '@components/modular';
import { SettingsTabNavigationProp } from '@appTypes';

interface AccessKeysWarningModalProps {
  walletHash: string;
  dismiss: () => void;
}

export const AccessKeysWarningModal = ({
  walletHash,
  dismiss
}: AccessKeysWarningModalProps) => {
  const { t } = useTranslation();
  const navigation: SettingsTabNavigationProp = useNavigation();

  const onViewRecoveryPress = async (): Promise<void> => {
    const onPasscodeApprove = () => {
      navigation.navigate('AccessKeys', { walletHash });
    };

    navigation.navigate('Passcode', {
      onPasscodeApprove,
      title: t('singleWallet.warning.button')
    });
    dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismiss}>
      <View style={styles.modal}>
        <TouchableWithoutFeedback>
          <View style={styles.container}>
            <View style={styles.header}>
              <Button onPress={dismiss}>
                <CloseIcon color="#ADADAD" />
              </Button>
            </View>

            {/* Body */}
            <View style={styles.inner}>
              <WarningIcon scale={2.25} color={COLORS.error400} />

              <Text
                fontSize={16}
                fontFamily="Inter_600SemiBold"
                color={COLORS.neutral800}
              >
                {t('singleWallet.warning.title')}
              </Text>

              <Text
                fontSize={14}
                fontFamily="Inter_500Medium"
                color={COLORS.neutral600}
                style={styles.innerTypography}
              >
                {t('singleWallet.warning.description.top')}
              </Text>

              <Text
                fontSize={14}
                fontFamily="Inter_500Medium"
                color={COLORS.neutral600}
                style={[styles.innerTypography, styles.innerTypographyMargin]}
              >
                {t('singleWallet.warning.description.bottom')}
              </Text>
            </View>
            <SecondaryButton
              style={styles.buttonWithIcon}
              onPress={onViewRecoveryPress}
            >
              <LeadEyeIcon />
              <Text
                fontSize={16}
                fontFamily="Inter_600SemiBold"
                color={COLORS.neutral0}
              >
                {t('singleWallet.warning.button')}
              </Text>
            </SecondaryButton>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};
