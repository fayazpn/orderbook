import { FONT_SIZES } from '@app/constants/themeConstants';
import * as S from '@app/pages/exchange/ExchangePage.styles';
import { Stack, Typography } from '@mui/material';

function RowLabel() {
  return (
    <S.RowLabel>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle2" fontSize={FONT_SIZES.xs}>
          Market Size
        </Typography>
        <Typography
          variant="subtitle2"
          fontSize={FONT_SIZES.xs}
          // marginLeft="-1rem"
        >
          Price(USD)
        </Typography>
        <Typography
          variant="subtitle2"
          fontSize={FONT_SIZES.xs}
          // marginLeft="-2rem"
        >
          My Size
        </Typography>
      </Stack>
    </S.RowLabel>
  );
}

export default RowLabel;
