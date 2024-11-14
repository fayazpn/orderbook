import { FONT_SIZES, FONT_WEIGHT } from '@app/constants/theme-constants';
import * as S from '@app/pages/exchange/ExchangePage.styles';

import { OrderSide } from '@app/types/types';
import { Stack, Typography } from '@mui/material';
import { green, red } from '@mui/material/colors';

type RowDataProps = {
  side: OrderSide;
  size: string;
  price: string;
  // total: string;
  // depth: number;
};

// Color constants using Material UI palette
const SELL_COLOR = red[500]; // Red for asks
const BUY_COLOR = green[500]; // Green for bids

function RowData({ side, size, price }: RowDataProps) {
  return (
    <S.RowData>
      {/* <SizeHighlight depth={depth} orderSide={side} /> */}
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
    </S.RowData>
  );
}

export default RowData;
