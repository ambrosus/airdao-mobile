import React, { useMemo, useState } from 'react';
import { Alert, StyleProp, View, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeNavigationProp } from '@appTypes';
import { Text } from '@components/base';
import { TextInput } from '@components/base/Input/Input.text';
import { PrimaryButton } from '@components/modular';
import { WalletUtils } from '@utils/wallet';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { Header } from '@components/composite';

export const ImportWalletPrivateKey = () => {
  const navigation: HomeNavigationProp = useNavigation();

  const [privateKey, setPrivateKey] = useState('');

  const onImportWalletHandle = async () => {
    try {
      await WalletUtils.importWalletViaPrivateKey(privateKey);
      navigation.replace('ImportWalletSuccess');
    } catch (error) {
      Alert.alert('Invalid private key');
      throw error;
    }
  };

  const containerStyle: StyleProp<ViewStyle> = useMemo(() => {
    return {
      flex: 1
    };
  }, []);

  const innerContainerStyle: StyleProp<ViewStyle> = useMemo(() => {
    return {
      flex: 1,
      marginTop: verticalScale(16),
      marginHorizontal: scale(20),
      justifyContent: 'space-between'
    };
  }, []);

  const disabled = useMemo(() => {
    return privateKey === '' && privateKey.length !== 64;
  }, [privateKey]);

  return (
    <SafeAreaView style={containerStyle}>
      <Header
        bottomBorder
        title={
          <Text
            fontFamily="Inter_600SemiBold"
            fontSize={16}
            color={COLORS.neutral800}
          >
            Import wallet
          </Text>
        }
        titlePosition="left"
        style={{ shadowColor: 'transparent' }}
      />

      <View style={innerContainerStyle}>
        <TextInput
          value={privateKey}
          onChangeText={setPrivateKey}
          placeholder="Private  key"
        />

        <PrimaryButton disabled={disabled} onPress={onImportWalletHandle}>
          <Text
            style={{ color: disabled ? COLORS.alphaBlack30 : COLORS.neutral0 }}
          >
            Import wallet
          </Text>
        </PrimaryButton>
      </View>
    </SafeAreaView>
  );
};
