import * as S from '@app/pages/exchange/ExchangePage.styles';
import { Typography } from '@mui/material';

function NoData() {
  return (
    <S.LoadingContainer alignItems="center" justifyContent="center">
      <Typography textAlign="center" variant="h6">
        No Data
      </Typography>
    </S.LoadingContainer>
  );
}

export default NoData;
