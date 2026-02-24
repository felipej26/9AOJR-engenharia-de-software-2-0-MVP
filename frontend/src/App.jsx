import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/toast-context';
import Layout from './components/layout';
import DashboardPage from './pages/dashboard-page';
import TransactionsPage from './pages/transactions-page';
import CategoriesPage from './pages/categories-page';
import BudgetsPage from './pages/budgets-page';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="budgets" element={<BudgetsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
