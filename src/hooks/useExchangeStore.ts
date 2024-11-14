import { AGG_VALUES } from '@app/constants/app-constants';
import {
  CoinPair,
  Level2Data,
  Level2Snapshot,
  OrderSide,
  TickerData,
} from '@app/types/types';
import { throttle } from 'lodash';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Order Book Types
type OrderBookLevel = [string, string]; // [price, size]

interface BestOrders {
  bestBid: string;
  bestBidSize: string;
  bestAsk: string;
  bestAskSize: string;
}

interface OrderBookState {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  bestOrders: BestOrders;
}

// Ticker Types
interface TickerState {
  type: 'ticker';
  trade_id: number;
  sequence: number;
  time: string;
  product_id: string;
  price: string;
  open_24h: string;
  volume_24h: string;
  low_24h: string;
  high_24h: string;
  volume_30d: string;
  best_bid: string;
  best_bid_size: string;
  best_ask: string;
  best_ask_size: string;
  side: OrderSide;
  time_micro: string;
  last_size: string;
}

// Combined State & Actions
interface ExchangeState extends OrderBookState {
  currentPair: CoinPair;
  ticker: TickerState[];
  rawBids: OrderBookLevel[]; // Store raw orders before aggregation
  rawAsks: OrderBookLevel[];
  aggregationValue: number;
  setAggregationValue: (value: number) => void;
  handleSnapshot: (snapshot: Level2Snapshot) => void;
  handleL2Update: (update: Level2Data) => void;

  // Ticker Actions
  handleTickerUpdate: (ticker: TickerData) => void;
  switchPair: (newPair: CoinPair) => void;
}

const MAX_BOOK_LEVELS = 150; // Keep top 100 levels for each side

export const useExchangeStore = create<ExchangeState>()(
  devtools(
    (set, get) => ({
      // Initial State
      currentPair: 'BTC-USD',
      bids: [],
      asks: [],
      rawBids: [], // New state for raw orders
      rawAsks: [], // New state for raw orders
      bestOrders: {
        bestBid: '0',
        bestBidSize: '0',
        bestAsk: '0',
        bestAskSize: '0',
      },
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
        const bids = [...snapshot.bids].sort(
          (a, b) => Number(b[0]) - Number(a[0])
        );
        const asks = [...snapshot.asks].sort(
          (a, b) => Number(a[0]) - Number(b[0])
        );

        // Limit raw orders to MAX_BOOK_LEVELS
        const limitedRawBids = bids.slice(0, MAX_BOOK_LEVELS);
        const limitedRawAsks = asks.slice(0, MAX_BOOK_LEVELS);

        // Aggregate the limited raw orders
        const aggregatedBids = aggregateOrders(
          limitedRawBids,
          get().aggregationValue,
          false
        );
        const aggregatedAsks = aggregateOrders(
          limitedRawAsks,
          get().aggregationValue,
          true
        );

        set({
          rawBids: limitedRawBids,
          rawAsks: limitedRawAsks,
          bids: aggregatedBids,
          asks: aggregatedAsks,
        });
      },

      handleL2Update: throttle((update: Level2Data) => {
        set((state) => {
          const newState = update.changes.reduce(
            (acc, [side, price, size]) => {
              const orderList =
                side === 'buy' ? [...state.rawBids] : [...state.rawAsks];
              const priceLevel = orderList.findIndex(
                (level) => level[0] === price
              );

              if (size === '0') {
                if (priceLevel !== -1) {
                  orderList.splice(priceLevel, 1);
                }
              } else {
                const newLevel: OrderBookLevel = [price, size];
                if (priceLevel !== -1) {
                  orderList[priceLevel] = newLevel;
                } else {
                  orderList.push(newLevel);
                }
              }

              orderList.sort((a, b) =>
                side === 'buy'
                  ? Number(b[0]) - Number(a[0])
                  : Number(a[0]) - Number(b[0])
              );

              const limitedOrders = orderList.slice(0, MAX_BOOK_LEVELS);

              if (side === 'buy') {
                acc.rawBids = limitedOrders;
              } else {
                acc.rawAsks = limitedOrders;
              }
              return acc;
            },
            {
              rawBids: [...state.rawBids],
              rawAsks: [...state.rawAsks],
            }
          );

          return {
            ...state,
            rawBids: newState.rawBids,
            rawAsks: newState.rawAsks,
            bids: aggregateOrders(
              newState.rawBids,
              state.aggregationValue,
              false
            ),
            asks: aggregateOrders(
              newState.rawAsks,
              state.aggregationValue,
              true
            ),
          };
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
          ticker: [], // Clear ticker data
          bids: [],
          asks: [],
          rawBids: [],
          rawAsks: [],
          bestOrders: {
            bestBid: '0',
            bestBidSize: '0',
            bestAsk: '0',
            bestAskSize: '0',
          },
        });
      },
    }),
    { name: 'exchange-store' }
  )
);

const aggregateOrders = (
  orders: OrderBookLevel[],
  aggValue: number,
  isAsk: boolean
): OrderBookLevel[] => {
  if (aggValue === AGG_VALUES[0]) return orders; // No aggregation needed for smallest value

  const aggregatedMap = new Map<string, number>();

  orders.forEach(([price, size]) => {
    // Round price to nearest aggregation value
    const priceNum = Number(price);
    const roundedPrice = isAsk
      ? Math.ceil(priceNum / aggValue) * aggValue
      : Math.floor(priceNum / aggValue) * aggValue;

    const existingSize = aggregatedMap.get(roundedPrice.toString()) || 0;
    aggregatedMap.set(roundedPrice.toString(), existingSize + Number(size));
  });

  // Convert Map to array of OrderBookLevel
  const aggregatedOrders: OrderBookLevel[] = Array.from(
    aggregatedMap.entries()
  ).map(([price, size]) => [price, size.toString()]);

  // Sort orders
  return aggregatedOrders.sort((a, b) =>
    isAsk ? Number(a[0]) - Number(b[0]) : Number(b[0]) - Number(a[0])
  );
};
