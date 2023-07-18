import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { Header } from '@components/composite';
import { Button, Spacer, Text } from '@components/base';
import { verticalScale } from '@utils/scaling';
import { useNavigation } from '@react-navigation/native';
import { AddWalletStackNavigationProp } from '@appTypes';
import { AddWalletFlowType, useAddWalletContext } from '@contexts';

export const AddWalletScreen = () => {
  const navigation = useNavigation<AddWalletStackNavigationProp>();
  const { setFlowType, setWalletName, setMnemonicLength } =
    useAddWalletContext();

  const onCreatePress = () => {
    setFlowType(AddWalletFlowType.CREATE_WALLET);
    setWalletName('');
    setMnemonicLength(128);
    navigation.navigate('CreateWalletScreen');
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <Header title="Add Wallet" />
      <Spacer value={verticalScale(24)} />
      <Button>
        <Text>Restore</Text>
      </Button>
      <Button onPress={onCreatePress}>
        <Text>Create</Text>
      </Button>
    </SafeAreaView>
  );
};
