import { ALLOWED_PAIRS } from '@app/constants/app-constants';
import { CoinPair } from '@app/types/types';

export const isAllowedPair = (pair: string | undefined): pair is CoinPair => {
  if (!pair) return false;

  return (ALLOWED_PAIRS as readonly string[]).includes(pair);
};

export const formatNumber = (num: number, decimals: number) =>
  num.toFixed(decimals);
