import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { HomeParamsList } from '@appTypes';
import { Text } from '@components/base';
import { SecondaryButton } from '@components/modular';
import { InfoIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';

type Props = NativeStackScreenProps<
  HomeParamsList,
  'ImportWalletPrivateKeyError'
>;

export const ImportWalletPrivateKeyError = ({ navigation, route }: Props) => {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.upperContainer}>
          <InfoIcon color={COLORS.error500} scale={1.5} />
          <Text
            fontSize={20}
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral900}
          >
            {route.params?.error === 'exist'
              ? 'Wallet already exists in your account.'
              : 'Invalid private key.'}
          </Text>
          <Text
            fontSize={16}
            fontFamily="Inter_500Medium"
            color={COLORS.neutral600}
          >
            Please try again.
          </Text>
        </View>
      </View>
      <SecondaryButton style={styles.button} onPress={navigation.goBack}>
        <Text
          fontSize={16}
          fontFamily="Inter_600SemiBold"
          color={COLORS.neutral800}
        >
          {t('button.continue')}
        </Text>
      </SecondaryButton>
    </SafeAreaView>
  );
};
