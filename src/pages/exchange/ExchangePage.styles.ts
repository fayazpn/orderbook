import { OrderSide } from '@app/types/types';
import { Box, Card, Paper, Stack, styled } from '@mui/material';

export const TopStatsWrapper = styled(Paper)({
  padding: '1rem 2rem',
});

type StatsCardProps = { $side: OrderSide };

export const StatsCard = styled(Card)(({ $side }: StatsCardProps) => ({
  background:
    $side === 'buy'
      ? 'linear-gradient(to bottom, rgba(0, 255, 0, 0.1), transparent)'
      : 'linear-gradient(to bottom, rgba(255, 0, 0, 0.1), transparent)',
  boxShadow:
    $side === 'buy'
      ? '0 0 20px rgba(0, 255, 0, 0.15), inset 0 0 30px rgba(0, 255, 0, 0.1)'
      : '0 0 20px rgba(255, 0, 0, 0.15), inset 0 0 30px rgba(255, 0, 0, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '.2em',
  minWidth: '30rem',
  border:
    $side === 'buy'
      ? '1px solid rgba(0, 255, 0, 0.1)'
      : '1px solid rgba(255, 0, 0, 0.1)',
}));

// ---------------------

export const PairGraphWrapper = styled(Paper)({
  padding: '1rem 2rem',
  // minHeight: '50rem',
  // height: '100%',
});

export const PairGraphContainer = styled(Paper)({
  marginTop: '3rem',
  border: 0,
});

// -----------------

export const OrderBookWrapper = styled(Paper)({
  padding: '.5em 1em',
  // minHeight: '25rem',
});

export const OrderBookContainer = styled(Box)({
  width: '15em',
  marginTop: '1em',
  marginInline: 'auto',
});

export const RowLabel = styled(Paper)({
  padding: '.2em .5em',
  marginInline: 'auto',
});

export const RowData = styled(Paper)({
  marginInline: 'auto',
  border: 0,
  position: 'relative',
  zIndex: 2,
});

export const SpreadContainer = styled(Paper)({
  padding: '.2em .5em',
  margin: '.2em 0',
});

export const AggrigateContainer = styled(Paper)({
  padding: '0.5em',
  marginTop: '1em',
});

export const LoadingContainer = styled(Stack)({
  minHeight: '30rem',
});
