import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Header } from '@components/composite';
import { AboutMenutItem } from './About.MenuItem';
import { Button, Spacer, Text } from '@components/base';
import { PlatformSpecificUtils } from '@utils/platform';
import { styles } from './styles';
import { Linking, TouchableOpacity, View } from 'react-native';
import { getModel, getUniqueId } from 'react-native-device-info';
import { Clipboard } from '@utils/clipboard';
import { UID } from '@lib';

// TODO add privacy policy and terms links
export const AboutScreen = () => {
  const { t } = useTranslation();

  // only for dev
  const ShowIDs = () => {
    // only for dev
    const [ID, setID] = useState('');
    const [UniqueId, setUnique] = useState('');
    const model = getModel().replace(/\s/g, '');

    const copyAddress = async (data: string, field: string) => {
      await Clipboard.copyToClipboard(`${field}: ${data}`);
    };

    useEffect(() => {
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
    }, []);
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
  };
  return (
    <SafeAreaView style={styles.container}>
      <Header
        bottomBorder
        title={t('settings.about')}
        style={{ backgroundColor: 'transparent' }}
      />
      {/* <Button>
        <AboutMenutItem title={t('settings.about.terms')} />
      </Button> */}
      <Button
        onPress={() =>
          Linking.openURL('https://airdao.io/mobile-privacy-policy')
        }
      >
        <AboutMenutItem title={t('settings.about.privacy')} />
      </Button>
      <Button type="base" onPress={PlatformSpecificUtils.requestReview}>
        <AboutMenutItem title={t('settings.about.rate')} />
      </Button>
      <ShowIDs />
    </SafeAreaView>
  );
};
