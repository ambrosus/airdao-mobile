import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
  const navigation: SettingsTabNavigationProp = useNavigation();

  const onViewRecoveryPress = async (): Promise<void> => {
    const onPasscodeApprove = () => {
      navigation.navigate('RecoveryPhrase', { walletHash });
    };

    navigation.navigate('Passcode', {
      onPasscodeApprove,
      title: 'Reveal access keys'
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
                Keep your Access keys safe
              </Text>

              <Text
                fontSize={14}
                fontFamily="Inter_500Medium"
                color={COLORS.neutral600}
                style={styles.innerTypography}
              >
                Your Access keys provides full access to you account and funds.
              </Text>

              <Text
                fontSize={14}
                fontFamily="Inter_500Medium"
                color={COLORS.neutral600}
                style={[styles.innerTypography, styles.innerTypographyMargin]}
              >
                Do not share this with anyone. The AirDAO team will never
                request this, but phishers might.
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
                Reveal access keys
              </Text>
            </SecondaryButton>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};
