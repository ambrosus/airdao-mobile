import { FC, useState } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  TouchableOpacity,
  View
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import * as Clipboard from 'expo-clipboard';
import { watcherService } from '@api/watcher-service';
import { Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import Config from '@constants/config';
import { useEffectOnce } from '@hooks';
import { NotificationService, UID } from '@lib';
import { DebugInfoItem } from '@screens/Settings/screens/About/DebugInfo/components/DebugInfoItem';
import { scale, StringUtils } from '@utils';
import { styles } from './styles';

interface DebugItemModel {
  id: string;
  data: string;
  name: string;
}

const watcherAPI = `${Config.WALLET_API_URL}/api/v1/watcher`;

export const DebugInfo: FC = () => {
  const [debugData, setDebugData] = useState([]);

  const getAllData = async () => {
    const currentPushToken = await NotificationService.getPushToken();
    const pushTokenFromFirebase = await messaging().getToken();
    const watcherInfo = await watcherService.getWatcherInfoOfCurrentUser();
    const watcherAddresses = watcherInfo?.addresses.map((item) =>
      StringUtils.formatAddress(item.address, 4, 4)
    );
    const deviceId = watcherInfo?.device_id || (await UID());

    const data = [
      {
        id: 'currentPushToken',
        name: 'Current Push Token',
        data: currentPushToken
      },
      {
        id: 'pushTokenFromFirebase',
        name: 'Push Token from Firebase',
        data: pushTokenFromFirebase
      },
      {
        id: 'pushTokenFromBackend',
        name: 'Push Token from backend',
        data: watcherInfo?.push_token
      },
      {
        id: 'userId',
        name: 'User  ID',
        data: watcherInfo?._id
      },
      {
        id: 'deviceId',
        name: 'Device ID',
        data: deviceId
      },
      {
        id: 'watcherAddreses',
        name: 'User watch to addresses',
        data: watcherAddresses?.join(',  ')
      },
      {
        id: 'watcherLink',
        name: 'Watcher link (currentPushToken)',
        data: `${watcherAPI}/${currentPushToken}`
      }
    ];
    // @ts-ignore
    setDebugData(data);
  };

  useEffectOnce(() => {
    getAllData().then();
  });

  const copyAll = async () => {
    if (debugData.length) {
      let copyData = '';
      debugData.map((item: DebugItemModel) => {
        copyData += `${item.name}:\n ${item.data} \n\n`;
      });
      await Clipboard.setStringAsync(copyData);
    }
  };

  return (
    <View style={styles.main}>
      <FlatList
        data={debugData}
        renderItem={({ item }: ListRenderItemInfo<DebugItemModel>) => {
          return <DebugInfoItem item={item} key={item.id} />;
        }}
      />
      <Spacer value={scale(15)} />
      <TouchableOpacity style={styles.copyAll} onPress={copyAll}>
        <Text color={COLORS.neutral0} align="center">
          Copy ALL
        </Text>
      </TouchableOpacity>
    </View>
  );
};
