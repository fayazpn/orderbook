// import {
//   BestOrders,
//   CoinPair,
//   Level2Data,
//   Level2Snapshot,
//   OrderBookLevel,
//   TickerData,
// } from '@app/types/types';
// import { throttle } from 'lodash';
// import { create } from 'zustand';
// import { devtools } from 'zustand/middleware';

// interface ExchangeState {
//   bids: OrderBookLevel[];
//   asks: OrderBookLevel[];
//   bestOrders: BestOrders | null;
//   currentPair: CoinPair;
//   handleSnapshot: (snapshot: Level2Snapshot) => void;
//   handleL2Update: (update: Level2Data) => void;
//   handleTickerUpdate: (ticker: TickerData) => void;
//   switchPair: (newPair: CoinPair) => void;
// }

// export const useExchangeStore = create<ExchangeState>()(
//   devtools(
//     (set, get) => ({
//       currentPair: 'BTC-USD',
//       bids: [],
//       asks: [],
//       bestOrders: null,

//       handleSnapshot: (snapshot) => {
//         set({
//           bids: snapshot.bids,
//           asks: snapshot.asks,
//         });
//       },

//       handleL2Update: throttle((update: Level2Data) => {
//         const state = get();
//         let bids = [...state.bids];
//         let asks = [...state.asks];

//         update.changes.forEach(([side, price, size]) => {
//           if (side === 'buy') {
//             const index = bids.findIndex(([p]) => p === price);
//             if (Number(size) === 0 && index !== -1) {
//               bids = bids.filter((_, i) => i !== index);
//             } else if (index !== -1) {
//               bids[index] = [price, size];
//             } else {
//               bids.push([price, size]);
//             }
//           } else {
//             const index = asks.findIndex(([p]) => p === price);
//             if (Number(size) === 0 && index !== -1) {
//               asks = asks.filter((_, i) => i !== index);
//             } else if (index !== -1) {
//               asks[index] = [price, size];
//             } else {
//               asks.push([price, size]);
//             }
//           }
//         });

//         set({ bids, asks });
//       }, 250),

//       handleTickerUpdate: (ticker) => {
//         if (ticker.product_id !== get().currentPair) return;
//         set({
//           bestOrders: {
//             bestBid: ticker.best_bid,
//             bestBidSize: ticker.best_bid_size,
//             bestAsk: ticker.best_ask,
//             bestAskSize: ticker.best_ask_size,
//           },
//         });
//       },

//       switchPair: (newPair: CoinPair) => {
//         if (newPair === get().currentPair) return;
//         set({
//           currentPair: newPair,
//           bids: [],
//           asks: [],
//           bestOrders: null,
//         });
//       },
//     }),
//     { name: 'exchange-store' }
//   )
// );

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

      handleTickerUpdate: (ticker) => {
        if (ticker.product_id !== get().currentPair) return;
        set({
          bestOrders: {
            bestBid: ticker.best_bid,
            bestBidSize: ticker.best_bid_size,
            bestAsk: ticker.best_ask,
            bestAskSize: ticker.best_ask_size,
          },
        });
      },

      switchPair: (newPair: CoinPair) => {
        if (newPair === get().currentPair) return;
        set({
          currentPair: newPair,
          bids: [],
          asks: [],
          bestOrders: null,
        });
      },
    }),
    { name: 'exchange-store' }
  )
);
