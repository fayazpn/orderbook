import { COINBASE_WS_URL } from '@app/constants/app-constants';
import {
  CoinPair,
  Level2Data,
  Level2Snapshot,
  TickerData,
} from '@app/types/types';
import { isAllowedPair } from '@app/utils/utils';
import { useCallback, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { useExchangeStore } from './useExchangeStore';

interface CoinbaseWSSub {
  type: 'subscribe' | 'unsubscribe';
  product_ids: CoinPair[];
  channels: string[];
}

type WSMessageType = Level2Snapshot | Level2Data | TickerData;

const useCoinbaseWebSocket = (coin: CoinPair) => {
  if (!isAllowedPair(coin)) {
    return;
  }

  const { handleSnapshot, handleL2Update, handleTickerUpdate, applyUpdates } =
    useExchangeStore();

  const handleMessage = useCallback(
    (message: WebSocketEventMap['message']) => {
      try {
        const parsedMessage = JSON.parse(message.data) as WSMessageType;

        switch (parsedMessage.type) {
          case 'snapshot':
            handleSnapshot(parsedMessage);
            break;
          case 'l2update':
            handleL2Update(parsedMessage);
            applyUpdates();
            break;
          case 'ticker':
            handleTickerUpdate(parsedMessage);
            break;
        }
      } catch (error) {
        console.error('Error processing websocket message:', error);
      }
    },
    [handleSnapshot, handleL2Update, handleTickerUpdate]
  );

  const { sendJsonMessage } = useWebSocket<WSMessageType>(COINBASE_WS_URL, {
    onOpen: () => console.log('Socket connection opened'),
    onClose: () => console.log('Socket connection closed'),
    onError: (event) => console.error('WebSocket error:', event),
    onMessage: handleMessage,
    shouldReconnect: () => true,
    reconnectInterval: 3000,
    reconnectAttempts: 10,
  });

  useEffect(() => {
    const subscribeMessage: CoinbaseWSSub = {
      type: 'subscribe',
      product_ids: [coin],
      channels: ['level2_batch', 'ticker'],
    };
    sendJsonMessage(subscribeMessage);

    // Cleanup: unsubscribe when component unmounts or coin changes
    return () => {
      const unsubscribeMessage: CoinbaseWSSub = {
        type: 'unsubscribe',
        product_ids: [coin],
        channels: ['level2_batch', 'ticker'],
      };
      sendJsonMessage(unsubscribeMessage);
    };
  }, [coin, sendJsonMessage]);
};

export default useCoinbaseWebSocket;
