import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { BridgeNetworkSelectors } from '@components/modular/Bridge/BridgeNetworkSelectors/BridgeNetwork.Selectors';
import { BridgeForm } from '../../modular/Bridge/BridgeForm/BridgeForm';
import { Spacer } from '@components/base';
import { scale } from '@utils/scaling';

export const BridgeTemplate = () => {
  return (
    <View style={styles.container}>
      <BridgeNetworkSelectors />
      <Spacer value={scale(32)} />
      <BridgeForm />
    </View>
  );
};
