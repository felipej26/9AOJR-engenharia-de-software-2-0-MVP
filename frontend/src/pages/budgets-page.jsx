import { useState, useEffect } from 'react';
import { getBudgets, createBudget } from '../services/budgets-service';
import { getCategories } from '../services/categories-service';
import { useToast } from '../context/toast-context';
import { parseApiError } from '../utils/parse-api-error';
import LoadingState from '../components/loading-state';
import ErrorState from '../components/error-state';
import EmptyState from '../components/empty-state';

const now = new Date();
const currentMonth = now.getMonth() + 1;
const currentYear = now.getFullYear();

export default function BudgetsPage() {
  const [list, setList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    categoryId: '',
    month: currentMonth,
    year: currentYear,
    limit_amount: '',
  });
  const { addToast } = useToast();

  const load = () => {
    setLoading(true);
    setError(null);
    Promise.all([getBudgets(), getCategories()])
      .then(([budgets, cats]) => {
        setList(Array.isArray(budgets) ? budgets : []);
        setCategories(Array.isArray(cats) ? cats.filter((c) => c.type === 'despesa') : []);
      })
      .catch((err) => setError(parseApiError(err).message))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(form.limit_amount, 10);
    if (!form.categoryId) {
      addToast({ type: 'error', message: 'Selecione uma categoria.' });
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      addToast({ type: 'error', message: 'Valor do orçamento deve ser positivo.' });
      return;
    }
    setSubmitting(true);
    createBudget({
      categoryId: form.categoryId,
      month: form.month,
      year: form.year,
      amount,
    })
      .then(() => {
        addToast({ type: 'success', message: 'Orçamento criado com sucesso.' });
        setForm((f) => ({ ...f, categoryId: '', limit_amount: '' }));
        load();
      })
      .catch((err) => {
        addToast({ type: 'error', message: parseApiError(err).message });
      })
      .finally(() => setSubmitting(false));
  };

  if (loading && list.length === 0) return <LoadingState />;
  if (error && list.length === 0) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="page budgets-page">
      <h1>Orçamentos</h1>

      <form className="form form-budget" onSubmit={handleSubmit}>
        <h2>Novo orçamento</h2>
        <div className="form-row">
          <label>
            Categoria (despesa) *
            <select
              value={form.categoryId}
              onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
              required
            >
              <option value="">Selecione</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>
          <label>
            Mês *
            <select
              value={form.month}
              onChange={(e) => setForm((f) => ({ ...f, month: parseInt(e.target.value, 10) }))}
            >
              {[1,2,3,4,5,6,7,8,9,10,11,12].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </label>
          <label>
            Ano *
            <input
              type="number"
              min={2020}
              max={2100}
              value={form.year}
              onChange={(e) => setForm((f) => ({ ...f, year: parseInt(e.target.value, 10) }))}
            />
          </label>
          <label>
            Valor limite *
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              value={form.limit_amount}
              onChange={(e) => setForm((f) => ({ ...f, limit_amount: e.target.value }))}
            />
          </label>
        </div>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Salvando…' : 'Criar orçamento'}
        </button>
      </form>

      <section className="list-section">
        <h2>Listagem</h2>
        {list.length === 0 ? (
          <EmptyState message="Nenhum orçamento cadastrado." />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Categoria</th>
                  <th>Mês/Ano</th>
                  <th>Limite</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {list.map((b) => (
                  <tr key={b.id} className={b.exceeded ? 'exceeded' : ''}>
                    <td>{b.category?.name ?? b.categoryId}</td>
                    <td>{b.month}/{b.year}</td>
                    <td>{formatMoney(b.amount)}</td>
                    <td>{b.exceeded ? 'Ultrapassado' : 'Dentro do limite'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function formatMoney(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value));
}
