import {
  MAX_ORDER_DISPLAY,
  PRICE_DECIMALS,
  SIZE_DECIMALS,
} from '@app/constants/app-constants';
import { useExchangeStore } from '@app/hooks/useExchangeStore';
import { aggregateOrders, formatNumber, isAllowedPair } from '@app/utils/utils';
import { useParams } from 'react-router-dom';

import Loader from '@app/components/common/Loader';
import NoData from '@app/components/common/NoData';
import { useMemo } from 'react';
import MemoizedRowData from './RowData';
import RowLabel from './RowLabel';
import Spread from './Spread';

function OrderBook() {
  const params = useParams();
  const { bids, asks, aggregationValue } = useExchangeStore();

  const isValidPair = useMemo(() => isAllowedPair(params.id), [params.id]);
  if (!isValidPair) {
    return <NoData />;
  }

  const topBids = useMemo(
    () =>
      aggregateOrders(
        bids.slice(-MAX_ORDER_DISPLAY).reverse(),
        aggregationValue,
        false
      ),
    [bids]
  );

  const topAsks = useMemo(
    () =>
      aggregateOrders(asks.slice(0, MAX_ORDER_DISPLAY), aggregationValue, true),
    [asks]
  );

  if (!topBids.length && !topAsks.length) {
    return <Loader />;
  }

  return (
    <>
      <RowLabel />
      {topBids.map(([price, size]) => (
        <MemoizedRowData
          key={price}
          size={formatNumber(size, SIZE_DECIMALS)}
          price={formatNumber(price, PRICE_DECIMALS)}
          side="buy"
        />
      ))}
      <Spread currency="USD" spreadAmnt={1} />
      {topAsks.map(([price, size]) => (
        <MemoizedRowData
          key={price}
          size={formatNumber(size, SIZE_DECIMALS)}
          price={formatNumber(price, PRICE_DECIMALS)}
          side="sell"
        />
      ))}
    </>
  );
}

export default OrderBook;
