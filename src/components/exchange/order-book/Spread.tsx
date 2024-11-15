import useExchangeStore from '@app/hooks/useExchangeStore';
import * as S from '@app/pages/exchange/ExchangePage.styles';
import { formatNumber } from '@app/utils/utils';
import { Stack, Typography } from '@mui/material';

import { useMemo } from 'react';

function Spread() {
  const { bids, asks } = useExchangeStore();

  const spreadData = useMemo(() => {
    if (!bids.length || !asks.length) return null;
    const bestBid = Number(bids[bids.length - 1]?.[0]) || 0;
    const bestAsk = Number(asks[0]?.[0]) || 0;
    const spreadValue = bestAsk - bestBid;

    return formatNumber(spreadValue, 2);
  }, [bids, asks]);

  return (
    <S.SpreadContainer>
      <Stack
        direction="row"
        alignItems="center"
        gap={3}
        justifyContent="center"
      >
        <Typography variant="subtitle2">USD Spread</Typography>
        <Typography variant="subtitle2">{spreadData || 0}</Typography>
      </Stack>
    </S.SpreadContainer>
  );
}

export default Spread;
