import { Q } from '@nozbe/watermelondb';
import { useNotificationTable } from './useNotificationTable';
import { useEffect, useState } from 'react';

export const useObserveNotificationCount = (): number => {
  const notificationsTable = useNotificationTable();
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const subscription = notificationsTable
      .query(Q.where('is_read', false))
      .observeCount()
      .subscribe((notificationCount) => {
        setCount(notificationCount);
      });
    return () => {
      subscription.unsubscribe();
    };
  }, [notificationsTable]);
  return count;
};
