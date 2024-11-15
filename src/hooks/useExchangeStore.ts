import { MAX_BOOK_LEVELS } from '@app/constants/app-constants';
import {
  BestOrders,
  CoinPair,
  Level2Data,
  Level2Snapshot,
  OrderBookLevel,
  OrderUpdate,
  TickerData,
} from '@app/types/types';
import { throttle } from 'lodash';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ExchangeState {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  bestOrders: BestOrders | null;
  currentPair: CoinPair;
  ticker: TickerData[];
  handleSnapshot: (snapshot: Level2Snapshot) => void;
  // handleBidUpdate: any;
  // handleAskUpdate: any;
  // updateBids: (update: OrderUpdate) => void;
  // updateAsks: (update: OrderUpdate) => void;
  applyUpdates: () => void;
  handleL2Update: (update: Level2Data) => void;
  handleTickerUpdate: (ticker: TickerData) => void;
  switchPair: (newPair: CoinPair) => void;
}

const updateQueue: { bids: OrderUpdate[]; asks: OrderUpdate[] } = {
  bids: [],
  asks: [],
};

export const useExchangeStore = create<ExchangeState>()(
  devtools(
    (set, get) => ({
      currentPair: 'BTC-USD',
      bids: [],
      asks: [],
      bestOrders: null,
      ticker: [],
      handleSnapshot: (snapshot) => {
        set({
          bids: snapshot.bids
            .slice(0, MAX_BOOK_LEVELS)
            .map(([p, s]) => [parseFloat(p), parseFloat(s)]),
          asks: snapshot.asks
            .slice(0, MAX_BOOK_LEVELS)
            .map(([p, s]) => [parseFloat(p), parseFloat(s)]),
        });
      },

      // Main update handler now calls separate bid/ask handlers
      handleL2Update: (update: Level2Data) => {
        // const { handleBidUpdate, handleAskUpdate } = get();
        // handleBidUpdate(update.changes);
        // handleAskUpdate(update.changes);
        const { currentPair } = get();

        if (update.product_id !== currentPair) {
          return;
        }
        update.changes.forEach((change) => {
          if (change[0] === 'buy') {
            updateQueue.bids.push(change);
          } else {
            // sell
            updateQueue.asks.push(change);
          }
        });
      },

      applyUpdates: throttle(() => {
        const { bids, asks } = get();
        const updatedBids = updateQueue.bids.reduce(
          (acc, update) => updateOrders(acc, update),
          bids
        );
        const updatedAsks = updateQueue.asks.reduce(
          (acc, update) => updateOrders(acc, update),
          asks
        );

        set({
          bids: updatedBids.slice(0, MAX_BOOK_LEVELS),
          asks: updatedAsks.slice(0, MAX_BOOK_LEVELS),
        });
        updateQueue.bids = [];
        updateQueue.asks = [];
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
        if (newPair === get().currentPair) return;
        updateQueue.bids = [];
        updateQueue.asks = [];
        set({
          currentPair: newPair,
          bids: [],
          asks: [],
          ticker: [],
          bestOrders: null,
        });
      },
    }),
    { name: 'exchange-store' }
  )
);

const updateOrders = (
  orders: OrderBookLevel[],
  update: OrderUpdate
): OrderBookLevel[] => {
  const [price, size] = update.slice(1).map(parseFloat);
  const index = orders.findIndex(([p]) => p === price);

  if (size === 0) {
    return index > -1 ? orders.filter((_, i) => i !== index) : orders;
  } else if (index > -1) {
    return orders.map((order, i) => (i === index ? [price, size] : order));
  } else {
    const newOrders = [...orders, [price, size]];
    return newOrders.sort((a, b) => a[0] - b[0]) as OrderBookLevel[];
  }
};
