import SectionHeader from '@app/components/common/SectionHeader';
import * as S from '@app/pages/exchange/ExchangePage.styles';
import { useParams } from 'react-router-dom';
import { isAllowedPair } from '@app/utils/utils';
import Graph from './Graph';
import { useMemo } from 'react';

function PairGraphContainer() {
  const params = useParams();
  const isValidPair = useMemo(() => isAllowedPair(params.id), [params.id]);

  const title = isValidPair ? params.id : '-';
  return (
    <S.PairGraphWrapper>
      <SectionHeader title={`${title} Current Price`} />
      <Graph />
    </S.PairGraphWrapper>
  );
}

export default PairGraphContainer;
