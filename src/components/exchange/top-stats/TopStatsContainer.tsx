import SectionHeader from '@app/components/common/SectionHeader';
import * as S from '@app/pages/exchange/ExchangePage.styles';
import { isAllowedPair } from '@app/utils/utils';
import { Stack } from '@mui/material';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import TopStats from './TopStats';

function TopStatsContainer() {
  const params = useParams();
  const isValidPair = useMemo(() => isAllowedPair(params.id), [params.id]);

  const title = isValidPair ? params.id : '-';

  return (
    <S.TopStatsWrapper>
      <SectionHeader title={`${title} Overall Statistics`} />
      <Stack
        direction={{ sm: 'column', lg: 'row' }}
        width="100%"
        height="100%"
        alignItems="center"
        justifyContent="space-evenly"
        padding=".5em"
        marginTop={2}
        gap={{ sm: 1 }}
      >
        <TopStats />
      </Stack>
    </S.TopStatsWrapper>
  );
}

export default TopStatsContainer;
