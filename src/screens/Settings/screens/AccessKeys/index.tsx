import React from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { styles } from './styles';
import { SettingsTabParamsList } from '@appTypes';
import { AccessKeysMnemonicTab } from '@screens/Settings/screens/AccessKeys/tabs/Mnemonic/AccessKeys.Mnemonic';
import { AccessKeysPrivateTab } from '@screens/Settings/screens/AccessKeys/tabs/Private/AccessKeys.Private';
import { Header } from '@components/composite';
import { AnimatedTabs } from '@components/modular';

type Props = NativeStackScreenProps<SettingsTabParamsList, 'AccessKeys'>;

export const AccessKeysScreen = ({ route }: Props) => {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <Header bottomBorder title={t('singleWallet.access.keys.title')} />

      <AnimatedTabs
        containerStyle={styles.container}
        tabs={[
          {
            title: t('singleWallet.tab.phrase'),
            view: <AccessKeysMnemonicTab walletHash={route.params.walletHash} />
          },
          {
            title: t('singleWallet.tab.keys'),
            view: <AccessKeysPrivateTab walletHash={route.params.walletHash} />
          }
        ]}
      />
    </SafeAreaView>
  );
};
