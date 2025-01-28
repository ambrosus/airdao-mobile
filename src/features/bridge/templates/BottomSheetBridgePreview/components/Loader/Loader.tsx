import { View } from 'react-native';
import { Spacer, Spinner } from '@components/base';
import { styles } from './styles';

export const Loader = () => (
  <View style={styles.main}>
    <Spacer value={60} />
    <Spinner size="large" />
    <Spacer value={100} />
  </View>
);
