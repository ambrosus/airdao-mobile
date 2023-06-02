import { useNotificationTable } from './useNotificationTable';
import { useCallback, useEffect, useState } from 'react';

export const useNotifications = (): {
  notifications: Notification[];
  loading: boolean;
} => {
  const notificationsTable = useNotificationTable();
  const [mappedNotifications, setMappedNotifications] = useState<
    Notification[]
  >([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const notifications = await notificationsTable.query().fetch();
      setLoading(false);
      const mapped = notifications.map((notification) =>
        notification.hydrate()
      );
      setMappedNotifications(
        mapped as unknown as React.SetStateAction<Notification[]>
      );
    } catch (error) {
      // ignore
      setLoading(false);
    }
  }, [notificationsTable]);
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);
  return { notifications: mappedNotifications, loading };
};
