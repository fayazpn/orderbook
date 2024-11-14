import Header from '@app/components/common/Header';
import { Outlet } from 'react-router-dom';
import * as S from './MainLayout.styles';

function MainLayout() {
  return (
    <>
      <Header />
      <S.PageContainer>
        <Outlet />
      </S.PageContainer>
    </>
  );
}

export default MainLayout;
