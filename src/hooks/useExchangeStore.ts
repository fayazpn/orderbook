import {
  BestOrders,
  CoinPair,
  Level2Data,
  Level2Snapshot,
  OrderBookLevel,
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
  handleBidUpdate: any;
  handleAskUpdate: any;
  handleL2Update: (update: Level2Data) => void;
  handleTickerUpdate: (ticker: TickerData) => void;
  switchPair: (newPair: CoinPair) => void;
}

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
          bids: snapshot.bids,
          asks: snapshot.asks,
        });
      },

      // Split update handler into two separate functions
      handleBidUpdate: throttle((changes: Level2Data['changes']) => {
        const bidUpdates = changes.filter(([side]) => side === 'buy');
        if (bidUpdates.length === 0) return;

        const state = get();
        let newBids = [...state.bids];

        bidUpdates.forEach(([_, price, size]) => {
          const index = newBids.findIndex(([p]) => p === price);
          if (Number(size) === 0) {
            newBids = newBids.filter(([p]) => p !== price);
          } else if (index !== -1) {
            newBids[index] = [price, size];
          } else {
            newBids.push([price, size]);
          }
        });

        set({ bids: newBids });
      }, 250),

      handleAskUpdate: throttle((changes: Level2Data['changes']) => {
        const askUpdates = changes.filter(([side]) => side === 'sell');
        if (askUpdates.length === 0) return;

        const state = get();
        let newAsks = [...state.asks];

        askUpdates.forEach(([_, price, size]) => {
          const index = newAsks.findIndex(([p]) => p === price);
          if (Number(size) === 0) {
            newAsks = newAsks.filter(([p]) => p !== price);
          } else if (index !== -1) {
            newAsks[index] = [price, size];
          } else {
            newAsks.push([price, size]);
          }
        });

        set({ asks: newAsks });
      }, 250),

      // Main update handler now calls separate bid/ask handlers
      handleL2Update: (update: Level2Data) => {
        const { handleBidUpdate, handleAskUpdate } = get();
        handleBidUpdate(update.changes);
        handleAskUpdate(update.changes);
      },

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
