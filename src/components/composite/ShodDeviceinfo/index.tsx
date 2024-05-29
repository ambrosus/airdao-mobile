import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { NotificationService, UID } from '@lib';
import { getModel, getUniqueId } from 'react-native-device-info';
import { Clipboard } from '@utils/clipboard';
import { Spacer } from '@components/base';
import * as Updates from 'expo-updates';
import Config from '@constants/config';

const ShowDeviceInfo = () => {
  // ONLY FOR DEV
  const isTest = Updates.channel === 'testnet' || Updates.channel === '';
  const [ID, setID] = useState('');
  const [UniqueId, setUnique] = useState('');
  const [pushToken, setPushToken] = useState('');

  const model = getModel().replace(/\s/g, '');

  const copyAddress = async (data: string, field: string) => {
    if (field === 'url') {
      await Clipboard.copyToClipboard(data);
    } else {
      await Clipboard.copyToClipboard(`${field}: ${data}`);
    }
  };

  useEffect(() => {
    if (isTest) {
      const getIDs = async () => {
        const _ID = await UID();
        setID(_ID);
      };

      const getUniqueIds = async () => {
        const UNIQUE = await getUniqueId();
        const _pushToken = await NotificationService.getPushToken();
        setPushToken(_pushToken);

        setUnique(UNIQUE);
      };
      getUniqueIds().then();
      getIDs().then();
    }
  }, [isTest]);

  if (isTest) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return (
      <View style={{ padding: 15 }}>
        <TouchableOpacity onPress={() => copyAddress(model, 'DEVICE NAME')}>
          <Text style={{ marginLeft: 5 }}>DEVICE NAME</Text>
          <Text>{model}</Text>
          <Spacer value={10} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => copyAddress(UniqueId, 'DEVICE UID')}>
          <Text style={{ marginLeft: 5 }}>DEVICE UID</Text>
          <Text>{UniqueId}</Text>
          <Spacer value={10} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => copyAddress(`${UniqueId}${model}`, 'ID TO HASH')}
        >
          <Text style={{ marginLeft: 5 }}>ID TO HASH</Text>
          <Text>{`${UniqueId}${model}`}</Text>
          <Spacer value={10} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => copyAddress(ID, 'UID-HASH TO BACKEND')}
        >
          <Text style={{ marginLeft: 5 }}>UID-HASH TO BACKEND</Text>
          <Text>{ID}</Text>
          <Spacer value={10} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => copyAddress(pushToken, 'UID-HASH TO BACKEND')}
        >
          <Text style={{ marginLeft: 5 }}>PUSH TOKEN</Text>
          <Text>{pushToken}</Text>
          <Spacer value={10} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            copyAddress(
              `${Config.WALLET_API_URL}/api/v1/watcher/${pushToken}`,
              'url'
            )
          }
        >
          <Text style={{ marginLeft: 5 }}>WATCHER INFO URL</Text>
          <Text
            numberOfLines={1}
          >{`${Config.WALLET_API_URL}/api/v1/watcher/${pushToken}`}</Text>
          <Spacer value={10} />
        </TouchableOpacity>
      </View>
    );
  } else {
    return <></>;
  }
};

export default ShowDeviceInfo;
