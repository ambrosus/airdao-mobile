import { TouchableOpacity, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Spacer, Text } from '@components/base';
import { StringUtils } from '@utils/string';
import { styles } from './styles';

export const DebugItem = ({ title, data }: { title: string; data: string }) => {
  const onPress = () => {
    Clipboard.setStringAsync(`${data}`).then();
  };
  return (
    <TouchableOpacity onPress={onPress} style={styles.main}>
      <Text style={styles.title}>{title}</Text>
      <Spacer value={7} />
      <View style={{ backgroundColor: 'white', padding: 5, borderRadius: 5 }}>
        <Text style={styles.data}>
          {StringUtils.formatAddress(data, 17, 7)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
