import * as S from '@app/pages/exchange/ExchangePage.styles';
import { Stack, Typography } from '@mui/material';

type SpreadPorps = {
  currency: string;
  spreadAmnt: number;
};
function Spread({ currency, spreadAmnt }: SpreadPorps) {
  return (
    <S.SpreadContainer>
      <Stack
        direction="row"
        alignItems="center"
        gap={3}
        justifyContent="center"
      >
        <Typography variant="subtitle2">{currency} Spread</Typography>
        <Typography variant="subtitle2">{spreadAmnt.toFixed(2)}</Typography>
      </Stack>
    </S.SpreadContainer>
  );
}

export default Spread;
