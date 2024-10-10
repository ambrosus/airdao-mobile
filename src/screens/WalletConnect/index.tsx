import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@components/base';
import { PrimaryButton } from '@components/modular';
import { StyleProp, TextInput, ViewStyle } from 'react-native';
import {
  useInitializeWalletKit,
  useWalletKitEventsManager
} from '@features/wallet-connect/lib/hooks';
import { ScreenLoader } from '@features/kosmos/components/base';
import { walletKit } from '@features/wallet-connect/utils';
import { ApprovalBottomSheet } from '@features/wallet-connect/components/templates/approval-bottom-sheet';

const containerStyle: StyleProp<ViewStyle> = {
  flex: 1,
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 16
};

export const WalletConnectScreen = () => {
  const initialized = useInitializeWalletKit();

  useWalletKitEventsManager(initialized);

  const [wcUri, setWcUri] = useState('');

  const onWalletConnectPress = useCallback(async () => {
    await walletKit.pair({ uri: wcUri });
  }, [wcUri]);

  if (!initialized) {
    return <ScreenLoader height="100%" />;
  }

  return (
    <SafeAreaView style={containerStyle}>
      <Text color="black">Wallet Connect</Text>

      <TextInput
        value={wcUri}
        onChangeText={setWcUri}
        placeholder="WC URI"
        style={{ borderWidth: 1, width: '100%', height: 60 }}
      />

      <PrimaryButton onPress={onWalletConnectPress}>
        <Text fontFamily="Inter_600SemiBold" color="white">
          Connect
        </Text>
      </PrimaryButton>

      <ApprovalBottomSheet />
    </SafeAreaView>
  );
};
