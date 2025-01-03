import React, { useState } from 'react';
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
import { useEffectOnce } from '@hooks';
import { NotificationService } from '@lib';
import { DebugInfoItem } from '@screens/Settings/screens/About/DebugInfo/components/DebugInfoItem';
import { scale, StringUtils } from '@utils';
import { styles } from './styles';

interface DebugItemModel {
  id: string;
  data: string;
  name: string;
}

export const DebugInfo: React.FC = () => {
  const [debugData, setDebugData] = useState([]);

  const getAllData = async () => {
    const currentPushToken = await NotificationService.getPushToken();
    const pushTokenFromFirebase = await messaging().getToken();
    const watcherInfo = await watcherService.getWatcherInfoOfCurrentUser();
    const watcherAddresses = watcherInfo?.addresses.map((item) =>
      StringUtils.formatAddress(item.address, 4, 4)
    );

    const data = [
      {
        id: 'currentPushToken',
        name: 'Current Push Token',
        data: StringUtils.formatAddress(currentPushToken, 15, 15)
      },
      {
        id: 'pushTokenFromFirebase',
        name: 'Push Token from Firebase',
        data: StringUtils.formatAddress(pushTokenFromFirebase, 15, 15)
      },
      {
        id: 'pushTokenFromBackend',
        name: 'Push Token from backend',
        data: StringUtils.formatAddress(watcherInfo?.push_token || '', 15, 15)
      },
      {
        id: 'userId',
        name: 'User  ID',
        data: watcherInfo?._id
      },
      {
        id: 'deviceId',
        name: 'Device ID',
        data: StringUtils.formatAddress(watcherInfo?.device_id || '', 15, 15)
      },
      {
        id: 'watcherAddreses',
        name: 'User watch to addresses',
        data: watcherAddresses?.join(',  ')
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
