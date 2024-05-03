import { useCallback, useEffect, useState } from 'react';
import Config from '@constants/config';

const WSS_BRIDGE_TRANSACTIONS_HISTORY_URL = Config.WSS_BRIDGE_HISTORY_URL;

export function useBridgeTransactionStatus(
  txHash?: string,
  needToConnect?: boolean
) {
  const [minSafetyBlocks, setMinSafetyBlocks] = useState(0);
  const [confirmations, setConfirmations] = useState(0);

  const initWSSConnector = useCallback(async () => {
    try {
      const ws = new WebSocket(
        `${WSS_BRIDGE_TRANSACTIONS_HISTORY_URL}?txHash=${txHash}`
      );

      ws.onmessage = async (event: MessageEvent<string>) => {
        const { data } = event;
        const { status, confirmations, minSafetyBlocks } = JSON.parse(data);
        setMinSafetyBlocks(minSafetyBlocks);

        if (status < 2) {
          setConfirmations(confirmations);
        }
      };
    } catch (error) {
      throw Error;
    }
  }, [txHash]);

  useEffect(() => {
    (async () => {
      if (txHash && needToConnect) {
        await initWSSConnector();
      }
    })();
  }, [initWSSConnector, needToConnect, txHash]);

  return { confirmations, minSafetyBlocks };
}
