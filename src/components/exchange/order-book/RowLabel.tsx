import { FONT_SIZES } from '@app/constants/theme-constants';
import * as S from '@app/pages/exchange/ExchangePage.styles';
import { Stack, Typography } from '@mui/material';

function RowLabel() {
  return (
    <S.RowLabel>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle2" fontSize={FONT_SIZES.xs}>
          Market Size
        </Typography>
        <Typography variant="subtitle2" fontSize={FONT_SIZES.xs}>
          Price(USD)
        </Typography>
        <Typography variant="subtitle2" fontSize={FONT_SIZES.xs}>
          My Size
        </Typography>
      </Stack>
    </S.RowLabel>
  );
}

export default RowLabel;
