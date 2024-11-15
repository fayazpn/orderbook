import Loader from '@app/components/common/Loader';
import NoData from '@app/components/common/NoData';
import {
  MAX_ORDER_DISPLAY,
  PRICE_DECIMALS,
  SIZE_DECIMALS,
} from '@app/constants/app-constants';
import { useExchangeStore } from '@app/hooks/useExchangeStore';
import { OrderBookLevel } from '@app/types/types';
import { aggregateOrders, formatNumber, isAllowedPair } from '@app/utils/utils';
import { memo, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import MemoizedRowData from './RowData';
import RowLabel from './RowLabel';
import Spread from './Spread';

const OrderBook = memo(() => {
  const params = useParams();
  const { bids, asks, aggregationValue, lastBids, lastAsks } =
    useExchangeStore();

  const isValidPair = useMemo(() => isAllowedPair(params.id), [params.id]);
  if (!isValidPair) {
    return <NoData />;
  }

  // Compare current value with previous value
  const hasChanged = (
    current: OrderBookLevel,
    prev: OrderBookLevel | undefined
  ) => {
    if (!prev) return true;
    return current[1] !== prev[1]; // Compare sizes
  };

  const topBids = useMemo(() => {
    const slicedBids = bids.slice(-MAX_ORDER_DISPLAY).reverse();
    const slicedPrevBids = lastBids.slice(-MAX_ORDER_DISPLAY).reverse();

    return aggregateOrders(slicedBids, aggregationValue, false).map(
      (currentBid, index) => ({
        price: formatNumber(currentBid[0], PRICE_DECIMALS),
        size: formatNumber(currentBid[1], SIZE_DECIMALS),
        key: currentBid[0],
        highlight: hasChanged(currentBid, slicedPrevBids[index]),
      })
    );
  }, [bids, lastBids, aggregationValue]);

  const topAsks = useMemo(() => {
    const slicedAsks = asks.slice(0, MAX_ORDER_DISPLAY);
    const slicedPrevAsks = lastAsks.slice(0, MAX_ORDER_DISPLAY);

    return aggregateOrders(slicedAsks, aggregationValue, true).map(
      (currentAsk, index) => ({
        price: formatNumber(currentAsk[0], PRICE_DECIMALS),
        size: formatNumber(currentAsk[1], SIZE_DECIMALS),
        key: currentAsk[0],
        highlight: hasChanged(currentAsk, slicedPrevAsks[index]),
      })
    );
  }, [asks, lastAsks, aggregationValue]);

  if (!topBids.length && !topAsks.length) {
    return <Loader />;
  }

  return (
    <>
      <RowLabel />
      {topBids.map(({ price, size, key, highlight }) => (
        <MemoizedRowData
          key={key}
          size={size}
          price={price}
          side="buy"
          highlight={highlight}
        />
      ))}
      <Spread currency="USD" spreadAmnt={1} />
      {topAsks.map(({ price, size, key, highlight }) => (
        <MemoizedRowData
          key={key}
          size={size}
          price={price}
          side="sell"
          highlight={highlight}
        />
      ))}
    </>
  );
});

OrderBook.displayName = 'OrderBook';
export default OrderBook;
