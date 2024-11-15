import { AGG_VALUES, ALLOWED_PAIRS } from '@app/constants/app-constants';
import { CoinPair, OrderBookLevel, OrderUpdate } from '@app/types/types';

export const isAllowedPair = (pair: string | undefined): pair is CoinPair => {
  if (!pair) return false;

  return (ALLOWED_PAIRS as readonly string[]).includes(pair);
};

export const formatNumber = (num: number, decimals: number) =>
  num.toFixed(decimals);

export const aggregateOrders = (
  orders: OrderBookLevel[],
  aggValue: number,
  isAsk: boolean
): OrderBookLevel[] => {
  if (aggValue === AGG_VALUES[0]) return orders;

  const aggregatedMap = new Map<string, number>();

  orders.forEach(([price, size]) => {
    const priceNum = Number(price);
    const roundedPrice = isAsk
      ? Math.ceil(priceNum / aggValue) * aggValue
      : Math.floor(priceNum / aggValue) * aggValue;

    const existingSize = aggregatedMap.get(roundedPrice.toString()) || 0;
    aggregatedMap.set(roundedPrice.toString(), existingSize + Number(size));
  });

  const aggregatedOrders: OrderBookLevel[] = Array.from(
    aggregatedMap.entries()
  ).map(([price, size]) => [Number(price), size]);

  return aggregatedOrders.sort((a, b) => (isAsk ? a[0] - b[0] : b[0] - a[0]));
};

export const updateOrders = (
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
