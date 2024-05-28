import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { UID } from '@lib';
import { getModel, getUniqueId } from 'react-native-device-info';
import { Clipboard } from '@utils/clipboard';
import { Spacer } from '@components/base';
import * as Updates from 'expo-updates';

const ShowDeviceInfo = () => {
  // ONLY FOR DEV
  const isTest = Updates.channel === 'testnet' || Updates.channel === '';
  const [ID, setID] = useState('');
  const [UniqueId, setUnique] = useState('');

  const model = getModel().replace(/\s/g, '');

  const copyAddress = async (data: string, field: string) => {
    await Clipboard.copyToClipboard(`${field}: ${data}`);
  };

  useEffect(() => {
    if (isTest) {
      const getIDs = async () => {
        const _ID = await UID();
        setID(_ID);
      };
      const getUniqueIds = async () => {
        const UNIQUE = await getUniqueId();
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
      </View>
    );
  } else {
    return <></>;
  }
};

export default ShowDeviceInfo;
