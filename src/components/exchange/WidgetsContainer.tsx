import { Box, Stack } from '@mui/material';
import OrderBookContainer from './order-book/OrderBookContainer';
import PairGraphContainer from './pair-graph/PairGraphContainer';
import TopStatsContainer from './top-stats/TopStatsContainer';

function WidgetsContainer() {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }}>
      <OrderBookContainer />
      <Box flex={1}>
        <TopStatsContainer />
        <PairGraphContainer />
      </Box>
    </Stack>
  );
}

export default WidgetsContainer;
