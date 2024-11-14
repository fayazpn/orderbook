import { Stack } from '@mui/material';
import OrderBookContainer from './order-book/OrderBookContainer';

function WidgetsContainer() {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }}>
      <OrderBookContainer />
      {/* <Box flex={1}>
        <TopStatsContainer />
        <PairGraphContainer />
      </Box> */}
    </Stack>
  );
}

export default WidgetsContainer;
