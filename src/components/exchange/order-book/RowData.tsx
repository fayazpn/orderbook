import { FONT_SIZES, FONT_WEIGHT } from '@app/constants/theme-constants';
import * as S from '@app/pages/exchange/ExchangePage.styles';

import { OrderSide } from '@app/types/types';
import { Stack, styled, Typography } from '@mui/material';
import { green, red } from '@mui/material/colors';
import { memo, useEffect, useState } from 'react';

// Styled component for the flashing row
const FlashingRow = styled(S.RowData)<{
  $isFlashing: boolean;
  $side: OrderSide;
}>(({ $isFlashing, $side }) => ({
  transition: 'background-color 0.5s ease-out',
  backgroundColor: $isFlashing
    ? $side === 'sell'
      ? 'rgba(255, 0, 0, 0.1)' // Light red flash for sells
      : 'rgba(0, 255, 0, 0.1)' // Light green flash for buys
    : 'transparent',
}));

type RowDataProps = {
  side: OrderSide;
  size: string;
  price: string;
  highlight: boolean;
};

const SELL_COLOR = red[500];
const BUY_COLOR = green[500];

function RowData({ side, size, price, highlight }: RowDataProps) {
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    if (highlight) {
      setIsFlashing(true);

      // Remove the flash effect after 500ms
      const timeout = setTimeout(() => {
        setIsFlashing(false);
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [highlight]);

  return (
    <FlashingRow $isFlashing={isFlashing} $side={side}>
      {/* <S.RowData> */}
      <Stack direction="row" justifyContent="space-between" paddingInline={2}>
        <Typography
          variant="subtitle1"
          fontSize={FONT_SIZES.xs}
          fontWeight={FONT_WEIGHT.semibold}
          flex={1}
        >
          {size}
        </Typography>
        <Typography
          variant="subtitle1"
          fontSize={FONT_SIZES.xs}
          fontWeight={FONT_WEIGHT.semibold}
          color={side === 'sell' ? SELL_COLOR : BUY_COLOR}
          flex={1}
        >
          {price}
        </Typography>
        <Typography
          variant="subtitle1"
          fontSize={FONT_SIZES.xs}
          fontWeight={FONT_WEIGHT.semibold}
        >
          -
        </Typography>
      </Stack>
      {/* </S.RowData> */}
    </FlashingRow>
  );
}
// const MemoizedRowData = RowData;
// Now we want to memo this component to prevent unnecessary re-renders
const MemoizedRowData = memo(RowData, (prevProps, nextProps) => {
  // Only re-render if any of these props change
  return (
    prevProps.price === nextProps.price &&
    prevProps.size === nextProps.size &&
    prevProps.highlight === nextProps.highlight &&
    prevProps.side === nextProps.side
  );
});
export default MemoizedRowData;
