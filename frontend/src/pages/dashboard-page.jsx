import { useState } from 'react';
import { getMonthlyReport } from '../services/reports-service';
import LoadingState from '../components/loading-state';
import ErrorState from '../components/error-state';
import { useAsyncResource } from '../hooks/use-async-resource';
import { formatMoney } from '../utils/format-money';
import {
  getTransactionTypeKeyword,
  TRANSACTION_TYPE,
} from '../constants/transaction-types';

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function now() {
  const d = new Date();
  return { month: d.getMonth() + 1, year: d.getFullYear() };
}

export default function DashboardPage() {
  const [period, setPeriod] = useState(now());
  const { data: report, loading, error, reload: load } = useAsyncResource(
    () => getMonthlyReport(period.month, period.year),
    [period.month, period.year],
  );

  const handleMonthChange = (e) => {
    const v = e.target.value;
    const m = v ? parseInt(v, 10) : period.month;
    setPeriod((p) => ({ ...p, month: m }));
  };
  const handleYearChange = (e) => {
    const v = e.target.value;
    const y = v ? parseInt(v, 10) : period.year;
    setPeriod((p) => ({ ...p, year: y }));
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const data = report || {};
  const totalReceita = data.totalReceita ?? 0;
  const totalDespesa = data.totalDespesa ?? 0;
  const saldo = data.saldo ?? 0;
  const byCategory = data.byCategory ?? [];
  const budgetStatus = data.budgetStatus ?? [];

  return (
    <div className="page dashboard-page">
      <h1>Dashboard</h1>

      <div className="dashboard-controls">
        <label>
          Mês
          <select value={period.month} onChange={handleMonthChange}>
            {MONTHS.map((name, i) => (
              <option key={i} value={i + 1}>{name}</option>
            ))}
          </select>
        </label>
        <label>
          Ano
          <input
            type="number"
            min={2020}
            max={2100}
            value={period.year}
            onChange={handleYearChange}
          />
        </label>
      </div>

      <section className="dashboard-summary">
        <div className="summary-card summary-receita">
          <span className="summary-label">Entradas</span>
          <span className="summary-value">{formatMoney(totalReceita)}</span>
        </div>
        <div className="summary-card summary-despesa">
          <span className="summary-label">Saídas</span>
          <span className="summary-value">{formatMoney(totalDespesa)}</span>
        </div>
        <div className="summary-card summary-saldo">
          <span className="summary-label">Saldo</span>
          <span className="summary-value">{formatMoney(saldo)}</span>
        </div>
      </section>

      {byCategory.length > 0 && (
        <section className="dashboard-by-category">
          <h2>Gastos por categoria</h2>
          <ul className="by-category-list">
            {byCategory.map((c) => (
              <li key={c.categoryId}>
                <span>{c.categoryName}</span>
                <span className={c.type === TRANSACTION_TYPE.DESPESA ? 'negative' : 'positive'}>
                  {formatMoney(c.total)} ({getTransactionTypeKeyword(c.type)})
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {budgetStatus.length > 0 && (
        <section className="dashboard-budget-status">
          <h2>Orçamentos no mês</h2>
          <ul className="budget-status-list">
            {budgetStatus.map((b) => (
              <li key={b.categoryId} className={b.exceeded ? 'exceeded' : ''}>
                <span>{b.categoryName}</span>
                <span>
                  {formatMoney(b.spent)} / {formatMoney(b.budgetAmount)}
                  {b.exceeded && ' (ultrapassado)'}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
