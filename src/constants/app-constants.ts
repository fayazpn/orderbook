export const ALLOWED_PAIRS = [
  'BTC-USD',
  'ETH-USD',
  'LTC-USD',
  'BCH-USD',
] as const;

export const AGG_VALUES = [0.01, 0.05, 0.1, 0.5, 1.0, 2.5, 5.0, 10.0] as const;

export const MAX_ORDER_DISPLAY = 15;
export const PRICE_DECIMALS = 2;
export const SIZE_DECIMALS = 5;
export const MAX_BOOK_LEVELS = 150;

export const COINBASE_WS_URL = 'wss://ws-feed.exchange.coinbase.com';
