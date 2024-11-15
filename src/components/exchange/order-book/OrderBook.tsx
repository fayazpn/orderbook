// import Loader from '@app/components/common/Loader';
// import NoData from '@app/components/common/NoData';
// import {
//   MAX_ORDER_DISPLAY,
//   PRICE_DECIMALS,
//   SIZE_DECIMALS,
// } from '@app/constants/app-constants';

// import { formatNumber, isAllowedPair } from '@app/utils/utils';

// import { useExchangeStore } from '@app/hooks/useExchangeStore';
// import { OrderBookLevel } from '@app/types/types';
// import { memo, useMemo } from 'react';
// import { useParams } from 'react-router-dom';
// import RowData from './RowData';
// import RowLabel from './RowLabel';
// import Spread from './Spread';

// // Memoized row component
// const OrderRow = memo(
//   ({
//     price,
//     size,
//     side,
//   }: {
//     price: string;
//     size: string;
//     side: 'buy' | 'sell';
//   }) => (
//     <RowData
//       size={formatNumber(parseFloat(size), SIZE_DECIMALS)}
//       price={formatNumber(parseFloat(price), PRICE_DECIMALS)}
//       side={side}
//       key={price}
//     />
//   )
// );

// // Memoized order processing
// const useProcessedOrders = (orders: OrderBookLevel[], maxDisplay: number) => {
//   return useMemo(() => {
//     return orders.filter(([_, size]) => Number(size) > 0).slice(0, maxDisplay);
//     // .map(([price, size]) => ({
//     //   price,
//     //   size,
//     // }));
//   }, [orders]);
// };

// function OrderBook() {
//   const params = useParams();
//   const { bids, asks } = useExchangeStore();
//   if (!isAllowedPair(params.id)) {
//     return <NoData />;
//   }

//   if (!bids.length && !asks.length) {
//     return <Loader />;
//   }

//   // Process orders with memoization
//   const processedBids = useProcessedOrders(bids, MAX_ORDER_DISPLAY);
//   const processedAsks = useProcessedOrders(asks, MAX_ORDER_DISPLAY);

//   return (
//     <>
//       <RowLabel />
//       {processedBids.map(([price, size]) => (
//         // <RowData
//         //   size={formatNumber(parseFloat(size), SIZE_DECIMALS)}
//         //   price={formatNumber(parseFloat(price), PRICE_DECIMALS)}
//         //   // total={formatNumber(rowTotal || 0, SIZE_DECIMALS)}
//         //   side="buy"
//         //   key={price} // price as key as it is unique
//         //   // depth={vis}
//         // />
//         <OrderRow key={price} price={price} size={size} side="buy" />
//       ))}
//       <Spread currency={'USD'} spreadAmnt={1} />
//       {processedAsks.slice(0, MAX_ORDER_DISPLAY).map(([price, size]) => (
//         // <RowData
//         //   size={formatNumber(parseFloat(size), SIZE_DECIMALS)}
//         //   price={formatNumber(parseFloat(price), PRICE_DECIMALS)}
//         //   // total={formatNumber(rowTotal || 0, SIZE_DECIMALS)}
//         //   side="sell"
//         //   key={price}
//         //   // depth={vis}
//         // />
//         <OrderRow key={price} price={price} size={size} side="sell" />
//       ))}
//     </>
//   );
// }

// export default OrderBook;

// import Loader from '@app/components/common/Loader';
// import NoData from '@app/components/common/NoData';
// import {
//   MAX_ORDER_DISPLAY,
//   PRICE_DECIMALS,
//   SIZE_DECIMALS,
// } from '@app/constants/app-constants';
// import { useExchangeStore } from '@app/hooks/useExchangeStore';
// import { formatNumber, isAllowedPair } from '@app/utils/utils';
// import { memo, useMemo } from 'react';
// import { useParams } from 'react-router-dom';
// import RowData from './RowData';
// import RowLabel from './RowLabel';
// import Spread from './Spread';

// // Memoized row component
// const OrderRow = memo(
//   ({
//     price,
//     size,
//     side,
//   }: {
//     price: string;
//     size: string;
//     side: 'buy' | 'sell';
//   }) => (
//     <RowData
//       size={formatNumber(parseFloat(size), SIZE_DECIMALS)}
//       price={formatNumber(parseFloat(price), PRICE_DECIMALS)}
//       side={side}
//     />
//   )
// );

// OrderRow.displayName = 'OrderRow';

// const OrderBook = memo(() => {
//   const params = useParams();
//   const { bids, asks } = useExchangeStore();

//   // Early returns for invalid states
//   const validPair = useMemo(() => isAllowedPair(params.id), [params.id]);
//   if (!validPair) {
//     return <NoData />;
//   }

//   // Process orders with memoization
//   const processedBids = useMemo(
//     () =>
//       bids.filter(([_, size]) => Number(size) > 0).slice(0, MAX_ORDER_DISPLAY),
//     [bids]
//   );

//   const processedAsks = useMemo(
//     () =>
//       asks.filter(([_, size]) => Number(size) > 0).slice(0, MAX_ORDER_DISPLAY),
//     [asks]
//   );

//   if (!processedBids.length && !processedAsks.length) {
//     return <Loader />;
//   }

//   return (
//     <>
//       <RowLabel />
//       {processedBids.map(([price, size]) => (
//         <OrderRow key={`bid-${price}`} price={price} size={size} side="buy" />
//       ))}
//       <Spread currency="USD" spreadAmnt={1} />
//       {processedAsks.map(([price, size]) => (
//         <OrderRow key={`ask-${price}`} price={price} size={size} side="sell" />
//       ))}
//     </>
//   );
// });

// OrderBook.displayName = 'OrderBook';

// export default OrderBook;

import Loader from '@app/components/common/Loader';
import NoData from '@app/components/common/NoData';
import {
  MAX_ORDER_DISPLAY,
  PRICE_DECIMALS,
  SIZE_DECIMALS,
} from '@app/constants/app-constants';
import { useExchangeStore } from '@app/hooks/useExchangeStore';
import { OrderBookLevel } from '@app/types/types';
import { formatNumber, isAllowedPair } from '@app/utils/utils';
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

  const processOrders = (orders: OrderBookLevel[], isBids: boolean) => {
    return orders
      .filter(([_, size]) => Number(size) > 0)
      .sort((a, b) =>
        isBids ? Number(b[0]) - Number(a[0]) : Number(a[0]) - Number(b[0])
      )
      .slice(0, MAX_ORDER_DISPLAY);
  };

  const processedBids = processOrders(bids, true);
  const processedAsks = processOrders(asks, false);

  return (
    <>
      <RowLabel />
      {processedBids.map(([price, size]) => (
        <RowData
          key={price}
          size={formatNumber(parseFloat(size), SIZE_DECIMALS)}
          price={formatNumber(parseFloat(price), PRICE_DECIMALS)}
          side="buy"
        />
      ))}
      <Spread currency="USD" spreadAmnt={1} />
      {processedAsks.map(([price, size]) => (
        <RowData
          key={price}
          size={formatNumber(parseFloat(size), SIZE_DECIMALS)}
          price={formatNumber(parseFloat(price), PRICE_DECIMALS)}
          side="sell"
        />
      ))}
    </>
  );
}

export default OrderBook;
