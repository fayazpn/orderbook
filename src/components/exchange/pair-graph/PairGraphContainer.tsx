import SectionHeader from '@app/components/common/SectionHeader';
import * as S from '@app/pages/exchange/ExchangePage.styles';
import { useParams } from 'react-router-dom';
import Graph from './Graph';

function PairGraphContainer() {
  const params = useParams();
  return (
    <S.PairGraphWrapper>
      <SectionHeader title={`${params.id} Current Price`} />
      <Graph />
    </S.PairGraphWrapper>
  );
}

export default PairGraphContainer;
