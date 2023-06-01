import { Q } from '@nozbe/watermelondb';
import { useNotificationTable } from './useNotificationTable';
import React, { useEffect, useState } from 'react';
import { Notification } from '@models';

export const useObserveNotifications = (
  ...query: Q.Clause[]
): Notification[] => {
  const notificationsTable = useNotificationTable();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const subscription = notificationsTable
      .query(query)
      .observe()
      .subscribe((notificationModels) => {
        setNotifications(
          notificationModels.map((notification) =>
            notification.hydrate()
          ) as unknown as React.SetStateAction<Notification[]>
        );
      });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationsTable]);
  return notifications;
};
