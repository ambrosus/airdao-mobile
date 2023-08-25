import React, { useState } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@components/composite';
import { COLORS } from '@constants/colors';
import { AddressInput } from './components';
import { styles } from './styles';

export const SendFunds = () => {
  const { t } = useTranslation();
  const [destinationAddress, setDestinationAddress] = useState('');
  return (
    <SafeAreaView edges={['top']}>
      <Header
        title={t('account.actions.send')}
        style={{ shadowColor: COLORS.white }}
      />
      <KeyboardAvoidingView style={styles.container}>
        <AddressInput
          address={destinationAddress}
          onAddressChange={setDestinationAddress}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
