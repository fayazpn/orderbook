import * as S from '@app/components/layouts/MainLayout.styles';
import { Box, Stack } from '@mui/material';
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
          {/* <AggDropDown /> */}

          <PairDropDown />
        </Stack>
      </S.TopNavWrapper>
    </Box>
  );
}

export default Header;
