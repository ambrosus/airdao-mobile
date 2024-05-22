import React, { useEffect, useMemo, useState } from 'react';
import { Header } from '@components/composite';
import { FlatList, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SettingsTabParamsList } from '@appTypes';
import { Button, Spacer, Text } from '@components/base';
import AirDAOKeysStorage from '@lib/crypto/AirDAOKeysStorage';
import { COLORS } from '@constants/colors';
import { AlertBanner, ToastType } from '@components/modular';
import { scale, verticalScale } from '@utils/scaling';
import { BackIcon } from '@components/svg/icons';

type Props = NativeStackScreenProps<SettingsTabParamsList, 'RecoveryPhrase'>;

export const RecoveryPhraseScreen = ({ route, navigation }: Props) => {
  const { t } = useTranslation();
  const [mnemonicPhrase, setMnemonicPhrase] = useState<string[]>([]);

  useEffect(() => {
    if (route.params.walletHash) {
      (async () => {
        const mnemonic = (
          await AirDAOKeysStorage.getWalletMnemonic(route.params.walletHash)
        ).split(' ');
        setMnemonicPhrase(mnemonic);
      })();
    }
  }, [route.params]);

  const renderLeftHeaderContent = useMemo(() => {
    return (
      <Button onPress={navigation.goBack} style={styles.header}>
        <BackIcon color={COLORS.neutral900} scale={1.15} />
        <Text
          fontSize={16}
          fontFamily="Inter_600SemiBold"
          color={COLORS.neutral900}
        >
          Go back
        </Text>
      </Button>
    );
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Header backIconVisible={false} contentLeft={renderLeftHeaderContent} />

      <View style={styles.heading}>
        <Text
          fontSize={24}
          fontFamily="Inter_700Bold"
          color={COLORS.neutral900}
        >
          Your recovery phrase
        </Text>

        <Text
          fontSize={16}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral900}
          style={styles.warning}
        >
          Make sure to write it down as shown. You will verify this later.
        </Text>
      </View>
      <Spacer value={scale(40)} />
      <View style={styles.containerDivider}>
        <FlatList
          data={mnemonicPhrase}
          renderItem={({ item, index }) => (
            <View key={index} style={styles.listItem}>
              <Text
                fontSize={14}
                fontFamily="Inter_600SemiBold"
                color={COLORS.neutral400}
              >
                {index + 1}.
              </Text>
              <Text
                fontSize={14}
                fontFamily="Inter_600SemiBold"
                color={COLORS.neutral900}
              >
                {item}
              </Text>
            </View>
          )}
          keyExtractor={(_, index) => index.toString()}
          numColumns={3}
          columnWrapperStyle={{ gap: 24, justifyContent: 'space-around' }}
          contentContainerStyle={styles.mnemonicContainer}
        />

        <View>
          <AlertBanner
            text={t('create.wallet.verification.alert')}
            type={ToastType.Highlight}
          />
          <Spacer value={verticalScale(34)} />
        </View>
      </View>
    </SafeAreaView>
  );
};
