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
import { updateOrders } from '@app/utils/utils';
import { throttle } from 'lodash';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ExchangeState {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  lastBids: OrderBookLevel[];
  lastAsks: OrderBookLevel[];
  bestOrders: BestOrders | null;
  currentPair: CoinPair;
  ticker: TickerData[];
  aggregationValue: number;
  setAggregationValue: (value: number) => void;
  handleSnapshot: (snapshot: Level2Snapshot) => void;
  updateOrders: () => void;
  handleL2Update: (update: Level2Data) => void;
  handleTickerUpdate: (ticker: TickerData) => void;
  switchPair: (newPair: CoinPair) => void;
}

const updateQueue: { bids: OrderUpdate[]; asks: OrderUpdate[] } = {
  bids: [],
  asks: [],
};

const useExchangeStore = create<ExchangeState>()(
  devtools(
    (set, get) => ({
      currentPair: 'BTC-USD',
      bids: [],
      asks: [],
      lastBids: [],
      lastAsks: [],
      bestOrders: null,
      ticker: [],
      aggregationValue: AGG_VALUES[0],
      setAggregationValue: (value) => {
        set({
          aggregationValue: value,
        });
      },

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

      handleL2Update: (update: Level2Data) => {
        const { currentPair } = get();

        if (update.product_id !== currentPair) {
          return;
        }
        update.changes.forEach((change) => {
          if (change[0] === 'buy') {
            updateQueue.bids.push(change);
          } else {
            updateQueue.asks.push(change);
          }
        });
      },

      updateOrders: throttle(() => {
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
          lastBids: bids,
          lastAsks: asks,
          bids: updatedBids.slice(0, MAX_BOOK_LEVELS),
          asks: updatedAsks.slice(0, MAX_BOOK_LEVELS),
        });
        updateQueue.bids = [];
        updateQueue.asks = [];
      }, 1000),

      handleTickerUpdate: throttle(
        (ticker) =>
          set((state) => {
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

export default useExchangeStore;
