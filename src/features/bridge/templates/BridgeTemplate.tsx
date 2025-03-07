import { View } from 'react-native';
import { Spacer } from '@components/base';
import { BridgeForm } from '@features/bridge/templates/BridgeForm/BridgeForm';
import { scale } from '@utils';
import { BridgeNetworkSelectors } from './BridgeNetworkSelectors/BridgeNetwork.Selectors';
import { styles } from './styles';

export const BridgeTemplate = () => {
  return (
    <View style={styles.container}>
      <BridgeNetworkSelectors />
      <Spacer value={scale(32)} />
      <BridgeForm />
    </View>
  );
};
