import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import MainLayout from './components/layouts/MainLayout';
import ExchangePage from './pages/exchange/ExchangePage';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/exchange/:id" element={<ExchangePage />} />

          {/* Wild card route to redirect to main */}
          <Route path="*" element={<Navigate to="/exchange/BTC-USD" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
