import * as S from '@app/layouts/MainLayout/MainLayout.styles';
import { Box, Stack, Typography } from '@mui/material';
import AggDropDown from './AggDropDown';
import PairDropDown from './PairDropDown';

function Header() {
  return (
    <Box width="100%" sx={{ backdropFilter: 'blur(1.5rem)' }}>
      <S.TopNavWrapper>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          mx="auto"
        >
          <AggDropDown />
          <Typography>CR Exchange</Typography>
          <PairDropDown />
        </Stack>
      </S.TopNavWrapper>
    </Box>
  );
}

export default Header;
