export type CoinPair = 'BTC-USD' | 'ETH-USD ' | 'LTC-USD' | 'BCH-USD';
export type OrderSide = 'buy' | 'sell';

export interface Level2Snapshot {
  type: 'snapshot';
  product_id: string;
  bids: [string, string][];
  asks: [string, string][];
  time: string;
}

export type OrderUpdate = [OrderSide, string, string];

export interface Level2Data {
  type: 'l2update';
  product_id: string;
  changes: OrderUpdate[];
  time: string;
}

export type OrderBookLevel = [string, string];

export interface BestOrders {
  bestBid: string;
  bestBidSize: string;
  bestAsk: string;
  bestAskSize: string;
}

export interface OrderBookState {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  bestOrders: BestOrders;
}

export interface TickerData {
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
