import { ALLOWED_PAIRS, MAX_ORDER_DISPLAY } from '@app/constants/appConstants';
import { CoinPair } from '@app/types/types';

export const isAllowedPair = (pair: string | undefined): pair is CoinPair => {
  if (!pair) return false;

  return (ALLOWED_PAIRS as readonly string[]).includes(pair);
};

// Function applies differences and add total of rows before and adds visual depth percentage

export const removePriceLevel = (
  price: number,
  levels: number[][]
): number[][] => {
  return levels.filter((level) => level[0] !== price);
};

export const updatePriceLevel = (
  deltaLevel: number[],
  levels: number[][]
): number[][] => {
  return levels.map((level) =>
    level[0] === deltaLevel[0] ? deltaLevel : level
  );
};

export const addPriceLevel = (
  deltaLevel: number[],
  levels: number[][]
): number[][] => {
  return [...levels, deltaLevel];
};

export const levelExists = (price: number, levels: number[][]): boolean => {
  return levels.some((level) => level[0] === price);
};

export const formatNumber = (num: number, decimals: number) =>
  num.toFixed(decimals);

export const getHighestBid = (bids: number[][]): number => {
  const prices: number[] = bids.map((bid) => bid[0]);
  return Math.max(...prices);
};

export const getLowestAsk = (asks: number[][]): number => {
  const prices: number[] = asks.map((ask) => ask[0]);
  return Math.min(...prices);
};

export const getSpreadAmount = (bids: number[][], asks: number[][]): number =>
  Math.abs(getHighestBid(bids) - getLowestAsk(asks));

export const getMaxTotalSum = (orders: number[][]): number => {
  const totalSums: number[] = orders.map((order) => order[2]);
  return Math.max(...totalSums);
};

export const addTotalSums = (orders: number[][]): number[][] => {
  orders.forEach((level, index) => {
    const totalSizeSum: number =
      index === 0 ? level[1] : level[1] + orders[index - 1][2];
    level.push(totalSizeSum);
  });

  const maxTotal = getMaxTotalSum(orders);

  return orders.map((order) => {
    if (typeof order[3] !== 'undefined') {
      return order;
    }
    const calculatedTotal: number = order[2];
    const depth = (calculatedTotal / maxTotal) * 100;
    const updatedOrder = [...order];
    updatedOrder[3] = depth;
    return updatedOrder;
  });
};

export const applyDeltas = (
  currentLevels: number[][],
  orders: number[][],
  side: string
): number[][] => {
  let updatedLevels = currentLevels;

  orders.forEach((deltaLevel) => {
    const deltaLevelPrice = deltaLevel[0];
    const deltaLevelSize = deltaLevel[1];

    // Always remove the price level if size is zero
    updatedLevels = removePriceLevel(deltaLevelPrice, updatedLevels);

    // Add or update the price level if the size is not zero
    if (deltaLevelSize !== 0) {
      if (levelExists(deltaLevelPrice, currentLevels)) {
        updatedLevels = updatePriceLevel(deltaLevel, updatedLevels);
      } else if (updatedLevels.length < MAX_ORDER_DISPLAY) {
        updatedLevels = addPriceLevel(deltaLevel, updatedLevels);
      }
    }
  });

  // Sort bids in descending order and offers in ascending order
  updatedLevels =
    side === 'bid'
      ? updatedLevels.sort((a, b) => b[0] - a[0])
      : updatedLevels.sort((a, b) => a[0] - b[0]);

  // Calculate the total sum of sizes for each row
  const updatedLevelsSum = addTotalSums(updatedLevels);

  // Add Visual percentage for highlight component

  return updatedLevelsSum;
};
