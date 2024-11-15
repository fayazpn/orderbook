import SectionHeader from '@app/components/common/SectionHeader';
import * as S from '@app/pages/exchange/ExchangePage.styles';
import { isAllowedPair } from '@app/utils/utils';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import OrderBook from './OrderBook';

function OrderBookContainer() {
  const params = useParams();

  const isValidPair = useMemo(() => isAllowedPair(params.id), [params.id]);

  const title = isValidPair ? params.id : '-';

  return (
    <S.OrderBookWrapper>
      <SectionHeader title={`${title} Order Book`} align="center" />
      <S.OrderBookContainer>
        <OrderBook />
      </S.OrderBookContainer>
    </S.OrderBookWrapper>
  );
}

export default OrderBookContainer;
