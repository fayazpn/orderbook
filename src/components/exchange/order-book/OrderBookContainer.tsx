import SectionHeader from '@app/components/common/SectionHeader';
import * as S from '@app/pages/exchange/ExchangePage.styles';
import { useParams } from 'react-router-dom';
import OrderBook from './OrderBook';

function OrderBookContainer() {
  const params = useParams();

  return (
    <S.OrderBookWrapper>
      <SectionHeader title={`${params.id} Order Book`} align="center" />
      <S.OrderBookContainer>
        <OrderBook />
      </S.OrderBookContainer>
    </S.OrderBookWrapper>
  );
}

export default OrderBookContainer;
