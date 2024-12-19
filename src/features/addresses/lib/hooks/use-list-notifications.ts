import { useEffect } from 'react';
import {
  AirDAOEventType,
  AirDAONotificationReceiveEventPayload
} from '@appTypes';
import { useAddressesStore } from '@entities/addresses';
import { useAddressesActions } from '@features/addresses';
import { AirDAOEventDispatcher } from '@lib';
import { AddressUtils } from '@utils';

export function useListNotifications() {
  const { allAddresses } = useAddressesStore();
  const { _dispatcher } = useAddressesActions();

  useEffect(() => {
    const onNewNotificationReceive = async (
      data: AirDAONotificationReceiveEventPayload
    ) => {
      if (data.type === 'transaction-alert') {
        const toIdx = allAddresses.findIndex(
          (address) => address.address === data.to
        );
        const fromIdx = allAddresses.findIndex(
          (address) => address.address === data.from
        );
        if (toIdx > -1) {
          const updatedSenderAddress = await AddressUtils.populateAddresses([
            allAddresses[toIdx]
          ]);
          _dispatcher({ type: 'update', payload: updatedSenderAddress[0] });
        }
        if (fromIdx > -1) {
          const updatedReceivingAddress = await AddressUtils.populateAddresses([
            allAddresses[fromIdx]
          ]);
          _dispatcher({ type: 'update', payload: updatedReceivingAddress[0] });
        }
      }
    };

    const notificationListener = AirDAOEventDispatcher.subscribe(
      AirDAOEventType.NotificationReceived,
      (payload) =>
        onNewNotificationReceive(
          payload as AirDAONotificationReceiveEventPayload
        )
    );

    return () => notificationListener.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
