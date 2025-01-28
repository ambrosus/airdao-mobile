import { useEffect, useState } from 'react';
import { AirDAOEventType } from '@appTypes';
import { useNotificationsQuery } from '@hooks';
import { useAppFocus } from '@hooks/useAppFocused';
import { AirDAOEventDispatcher } from '@lib';
import { Cache, CacheKey } from '@lib/cache';

export function useNewNotificationsCount(): number {
  const [newNotificationsCount, setNewNotificationsCount] = useState(0);
  const { data: notifications, refetch } = useNotificationsQuery();
  const focused = useAppFocus();

  const checkNewNotificationCount = async () => {
    // refetch data
    if (typeof refetch === 'function') refetch();
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
  }, [focused, notifications]);

  useEffect(() => {
    const notificationListenter = AirDAOEventDispatcher.subscribe(
      AirDAOEventType.NotificationReceived,
      checkNewNotificationCount
    );
    return () => notificationListenter.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return newNotificationsCount;
}
