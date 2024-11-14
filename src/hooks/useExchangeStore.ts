import { AGG_VALUES, MAX_BOOK_LEVELS } from '@app/constants/app-constants';
import {
  BestOrders,
  CoinPair,
  Level2Data,
  Level2Snapshot,
  OrderBookLevel,
  OrderUpdate,
  TickerData,
} from '@app/types/types';
import { aggregateOrders } from '@app/utils/utils';
import { throttle } from 'lodash';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ExchangeState {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  bestOrders: BestOrders | null;
  currentPair: CoinPair;
  ticker: TickerData[];
  rawBids: OrderBookLevel[];
  rawAsks: OrderBookLevel[];
  aggregationValue: number;
  setAggregationValue: (value: number) => void;
  handleSnapshot: (snapshot: Level2Snapshot) => void;
  handleL2Update: (update: Level2Data) => void;

  handleTickerUpdate: (ticker: TickerData) => void;
  switchPair: (newPair: CoinPair) => void;
}

export const useExchangeStore = create<ExchangeState>()(
  devtools(
    (set, get) => ({
      // Initial State
      currentPair: 'BTC-USD',
      bids: [],
      asks: [],
      rawBids: [],
      rawAsks: [],
      bestOrders: null,
      ticker: [],
      aggregationValue: AGG_VALUES[0],

      setAggregationValue: (value) => {
        const { rawBids, rawAsks } = get();
        set(() => ({
          aggregationValue: value,
          bids: aggregateOrders(rawBids, value, false),
          asks: aggregateOrders(rawAsks, value, true),
        }));
      },

      // Order Book Actions
      handleSnapshot: (snapshot) => {
        const bids = [...snapshot.bids]
          .slice(0, MAX_BOOK_LEVELS)
          .sort((a, b) => Number(b[0]) - Number(a[0]));
        const asks = [...snapshot.asks]
          .slice(0, MAX_BOOK_LEVELS)
          .sort((a, b) => Number(a[0]) - Number(b[0]));

        // const limitedRawBids = bids.slice(0, MAX_BOOK_LEVELS);
        // const limitedRawAsks = asks.slice(0, MAX_BOOK_LEVELS);

        // const aggregatedBids = aggregateOrders(
        //   bids,
        //   get().aggregationValue,
        //   false
        // );
        // const aggregatedAsks = aggregateOrders(
        //   asks,
        //   get().aggregationValue,
        //   true
        // );

        set({
          rawBids: bids,
          rawAsks: asks,
          bids: bids,
          asks: asks,
        });
      },

      handleL2Update: throttle((update: Level2Data) => {
        const { bids, asks } = get();
        const bidUpdates = update.changes.filter(
          (update) => update[0] === 'buy'
        );
        const askUpdates = update.changes.filter(
          (update) => update[0] === 'sell'
        );

        const updatedBids = bidUpdates.reduce(
          (acc, update) => updateOrders(acc, update, true),
          bids
        );

        const updatedAsks = askUpdates.reduce(
          (acc, update) => updateOrders(acc, update, false),
          asks
        );

        console.log(bids.length, asks.length);

        set({
          bids: updatedBids,
          asks: updatedAsks,
          rawBids: bids,
          rawAsks: asks,
        });
      }, 1000),

      handleTickerUpdate: throttle(
        (ticker) =>
          set((state) => {
            // Only update if the ticker matches current pair
            if (ticker.product_id !== state.currentPair) {
              return state;
            }

            const currentTime = new Date().getTime();
            const oneMinuteAgo = currentTime - 60000;
            const newTickerData = [...state.ticker, ticker];
            return {
              bestOrders: {
                bestBid: ticker.best_bid,
                bestBidSize: ticker.best_bid_size,
                bestAsk: ticker.best_ask,
                bestAskSize: ticker.best_ask_size,
              },
              ticker: newTickerData.filter((item) => {
                const timestamp = new Date(item.time).getTime();
                return timestamp >= oneMinuteAgo;
              }),
            };
          }),
        1500
      ),

      switchPair: (newPair: CoinPair) => {
        const { currentPair } = get();
        if (currentPair === newPair) return;

        // Complete reset when switching pairs
        set({
          currentPair: newPair,
          ticker: [],
          bids: [],
          asks: [],
          rawBids: [],
          rawAsks: [],
          bestOrders: null,
        });
      },
    }),
    { name: 'exchange-store' }
  )
);

const updateOrders = (
  orders: OrderBookLevel[],
  update: OrderUpdate,
  isBid: boolean
): OrderBookLevel[] => {
  const [price, size] = update.slice(1);
  const index = orders.findIndex(([p]) => p === price);
  let newOrders: OrderBookLevel[];

  if (size === '0') {
    newOrders = index > -1 ? orders.filter((_, i) => i !== index) : orders;
  } else if (index > -1) {
    newOrders = orders.map((order, i) => (i === index ? [price, size] : order));
  } else {
    newOrders = [...orders, [price, size]];
  }

  return newOrders
    .sort((a, b) =>
      isBid ? Number(b[0]) - Number(a[0]) : Number(a[0]) - Number(b[0])
    )
    .slice(0, MAX_BOOK_LEVELS);
};
