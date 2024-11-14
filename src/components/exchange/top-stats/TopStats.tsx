import Loader from '@app/components/common/Loader';
import NoData from '@app/components/common/NoData';

import { useExchangeStore } from '@app/hooks/useExchangeStore';
import { CoinPair } from '@app/types/types';
import { isAllowedPair } from '@app/utils/utils';
import { useParams } from 'react-router-dom';
import StatsCard from './StatsCard';

function TopStats() {
  const params = useParams();
  const pair = params.id as CoinPair;

  const bestOrders = useExchangeStore((state) => state.bestOrders);

  if (!pair || !isAllowedPair(pair)) {
    return <NoData />;
  }

  if (!bestOrders) {
    return <Loader />;
  }

  return (
    <>
      <StatsCard
        side="buy"
        price={bestOrders.bestBid}
        size={bestOrders.bestBidSize}
        pair={pair}
      />
      <StatsCard
        side="sell"
        price={bestOrders.bestAsk}
        size={bestOrders.bestAskSize}
        pair={pair}
      />
    </>
  );
}

export default TopStats;
