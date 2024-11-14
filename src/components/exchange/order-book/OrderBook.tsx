import Loader from '@app/components/common/Loader';
import NoData from '@app/components/common/NoData';
import {
  MAX_ORDER_DISPLAY,
  PRICE_DECIMALS,
  SIZE_DECIMALS,
} from '@app/constants/appConstants';

import { formatNumber, isAllowedPair } from '@app/utils/utils';

import { useExchangeStore } from '@app/hooks/useExchangeStore';
import { useParams } from 'react-router-dom';
import RowData from './RowData';
import RowLabel from './RowLabel';
import Spread from './Spread';

function OrderBook() {
  const params = useParams();
  const { bids, asks } = useExchangeStore();
  if (!isAllowedPair(params.id)) {
    return <NoData />;
  }

  if (!bids.length && !asks.length) {
    return <Loader />;
  }

  return (
    <>
      <RowLabel />
      {bids.slice(0, MAX_ORDER_DISPLAY).map(([price, size]) => (
        <RowData
          size={formatNumber(parseFloat(size), SIZE_DECIMALS)}
          price={formatNumber(parseFloat(price), PRICE_DECIMALS)}
          // total={formatNumber(rowTotal || 0, SIZE_DECIMALS)}
          side="buy"
          key={price} // price as key as it is unique
          // depth={vis}
        />
      ))}
      <Spread currency={'USD'} spreadAmnt={1} />
      {asks.slice(0, MAX_ORDER_DISPLAY).map(([price, size]) => (
        <RowData
          size={formatNumber(parseFloat(size), SIZE_DECIMALS)}
          price={formatNumber(parseFloat(price), PRICE_DECIMALS)}
          // total={formatNumber(rowTotal || 0, SIZE_DECIMALS)}
          side="sell"
          key={price}
          // depth={vis}
        />
      ))}
    </>
  );
}

export default OrderBook;
