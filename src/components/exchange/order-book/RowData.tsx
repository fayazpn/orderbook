import { FONT_SIZES, FONT_WEIGHT } from '@app/constants/theme-constants';
import * as S from '@app/pages/exchange/ExchangePage.styles';

import { OrderSide } from '@app/types/types';
import { Stack, Typography } from '@mui/material';
import { green, red } from '@mui/material/colors';
import { useEffect, useState } from 'react';

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
  }, [highlight, size]);

  return (
    <S.FlashingRow $isFlashing={isFlashing} $side={side}>
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
    </S.FlashingRow>
  );
}

export default RowData;
