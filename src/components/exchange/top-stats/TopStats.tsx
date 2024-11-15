import Loader from '@app/components/common/Loader';
import NoData from '@app/components/common/NoData';

import useExchangeStore from '@app/hooks/useExchangeStore';
import { CoinPair } from '@app/types/types';
import { isAllowedPair } from '@app/utils/utils';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import StatsCard from './StatsCard';

function TopStats() {
  const params = useParams();
  const pair = params.id as CoinPair;

  const bestOrders = useExchangeStore((state) => state.bestOrders);

  const isValidPair = useMemo(() => isAllowedPair(params.id), [params.id]);
  if (!isValidPair) {
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
