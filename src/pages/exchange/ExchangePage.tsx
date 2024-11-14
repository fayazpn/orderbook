import WidgetsContainer from '@app/components/exchange/WidgetsContainer';
import useCoinbaseWebSocket from '@app/hooks/useExchangeWS';
import { CoinPair } from '@app/types/types';
import { useParams } from 'react-router-dom';

function ExchangePage() {
  const params = useParams();
  const pair = params.id as CoinPair;

  // Initialize WebSocket connection
  useCoinbaseWebSocket(pair);

  return <WidgetsContainer />;
}

export default ExchangePage;
