import React, { useState } from 'react';
import { DebugItem } from './components/DebugItem';
import * as Updates from 'expo-updates';
import messaging from '@react-native-firebase/messaging';
import { Cache, CacheKey } from '@lib/cache';
import { UID } from '@lib';
import { API } from '@api/api';
import { useFocusEffect } from '@react-navigation/native';

export const DebugMode = () => {
  const isProd = Updates.channel === 'prod';

  const [watcherID, setWatcherID] = useState('');
  const [tokenFromBackend, setTokenFromBackend] = useState('');
  const [tokenFromFirebase, setTokenFromFirebase] = useState('');
  const [tokenFromDB, setTokenFromDb] = useState('');
  const [_UID, setUID] = useState('');

  useFocusEffect(() => {
    const getWatcherID = async () => {
      const watcherInfo =
        await API.watcherService.getWatcherInfoOfCurrentUser();
      if (watcherInfo?._id) {
        setWatcherID(watcherInfo._id);
      }
      if (watcherInfo?.push_token) {
        setTokenFromBackend(watcherInfo?.push_token);
      }
    };

    const getTokenFromFirebase = async () => {
      const token = await messaging().getToken();
      if (token) {
        setTokenFromFirebase(token);
      }
    };
    const getTokenFromDB = async () => {
      const token = await Cache.getItem(CacheKey.NotificationToken);
      if (token) {
        setTokenFromDb(`${token}`);
      }
    };

    const getUID = async () => {
      const id = await UID();
      if (id) {
        setUID(id);
      }
    };
    if (!isProd) {
      getWatcherID().then();
      getTokenFromFirebase().then();
      getTokenFromDB().then();
      getUID().then();
    }
  });

  if (isProd) {
    return <></>;
  }

  return (
    <>
      <DebugItem title={'Watcher ID'} data={watcherID} />
      <DebugItem title={'Token from backend'} data={tokenFromBackend} />
      <DebugItem title={'Token from firebase'} data={tokenFromFirebase} />
      <DebugItem title={'Token from DB'} data={tokenFromDB} />
      <DebugItem title={'UUID'} data={_UID} />
    </>
  );
};
