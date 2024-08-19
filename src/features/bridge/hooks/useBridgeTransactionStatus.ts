import { useCallback, useEffect, useState } from 'react';
import Config from '@constants/config';
import { keepWSAlive } from '@utils/keepWSlive';

const POINTED_STAGES = ['1.1', '2.1', '2.2', '3.1', '3.1', '4'];
const WSS_BRIDGE_TRANSACTIONS_HISTORY_URL = Config.WSS_BRIDGE_HISTORY_URL;

export function useBridgeTransactionStatus(
  txHash?: string,
  needToConnect?: boolean
) {
  const [stage, setStage] = useState('1.1');
  const [minSafetyBlocks, setMinSafetyBlocks] = useState(0);
  const [confirmations, setConfirmations] = useState(0);

  const initWSSConnector = useCallback(async () => {
    try {
      await new Promise((resolve, reject) => {
        const ws = new WebSocket(
          `${WSS_BRIDGE_TRANSACTIONS_HISTORY_URL}?txHash=${txHash}`
        );

        const intervalId = keepWSAlive(ws);

        ws.onmessage = async (event: MessageEvent<string>) => {
          const { data } = event;
          const { status, confirmations, minSafetyBlocks } = JSON.parse(data);
          setMinSafetyBlocks(minSafetyBlocks);

          const transformedStages = POINTED_STAGES[status];
          setStage(transformedStages);

          if (status < 2) return;
          setConfirmations(confirmations);

          if (status === 5) {
            ws.close();
            resolve(null);
          }

          ws.onerror = (error) => {
            reject(error);
          };
          ws.onclose = () => {
            reject('WebSocket closed unexpectedly');
            clearInterval(intervalId);
          };
        };
      });
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 500)); // sleep 0.5s
    }
  }, [txHash]);

  useEffect(() => {
    (async () => {
      if (needToConnect) {
        await initWSSConnector();
      }
    })();
  }, [initWSSConnector, needToConnect, txHash]);

  return { stage, confirmations, minSafetyBlocks };
}
