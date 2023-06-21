import { useEffect, useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { useNotificationsQuery } from '@hooks';
import { Cache, CacheKey } from '@utils/cache';
import useAppFocus from '@hooks/useAppFocused';
import { EVENTS } from '@constants/events';

export function useNewNotificationsCount(): number {
  const [newNotificationsCount, setNewNotificationsCount] = useState(0);
  const { data: notifications } = useNotificationsQuery();
  const focused = useAppFocus();

  const checkNewNotificationCount = async () => {
    const res =
      ((await Cache.getItem(CacheKey.LastNotificationTimestamp)) as number) ||
      0;
    const count = notifications.filter((notification) => {
      return notification.createdAt.getTime() > res;
    })?.length;
    setNewNotificationsCount(count);
  };

  useEffect(() => {
    if (focused) checkNewNotificationCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focused]);

  useEffect(() => {
    const notificationListener = DeviceEventEmitter.addListener(
      EVENTS.NotificationReceived,
      checkNewNotificationCount
    );
    return () => notificationListener.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return newNotificationsCount;
}
