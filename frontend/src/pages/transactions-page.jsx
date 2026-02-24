import { useState, useEffect } from 'react';
import { getTransactions } from '../services/transactions-service';
import { createTransaction } from '../services/transactions-service';
import { getCategories } from '../services/categories-service';
import { useToast } from '../context/toast-context';
import { parseApiError } from '../utils/parse-api-error';
import LoadingState from '../components/loading-state';
import ErrorState from '../components/error-state';
import EmptyState from '../components/empty-state';

const TYPES = [
  { value: 'receita', label: 'Receita' },
  { value: 'despesa', label: 'Despesa' },
];

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function TransactionsPage() {
  const [list, setList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    type: 'despesa',
    amount: '',
    date: todayStr(),
    description: '',
    categoryId: '',
  });
  const { addToast } = useToast();

  const load = () => {
    setLoading(true);
    setError(null);
    const params = {};
    if (filterMonth) params.month = parseInt(filterMonth, 10);
    if (filterYear) params.year = parseInt(filterYear, 10);
    Promise.all([
      getTransactions(params),
      getCategories(),
    ])
      .then(([transactions, cats]) => {
        setList(Array.isArray(transactions) ? transactions.filter((t) => !t.deletedAt) : []);
        setCategories(Array.isArray(cats) ? cats : []);
      })
      .catch((err) => setError(parseApiError(err).message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [filterMonth, filterYear]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(form.amount, 10);
    if (!form.categoryId) {
      addToast({ type: 'error', message: 'Selecione uma categoria.' });
      return;
    }
    if (!form.date) {
      addToast({ type: 'error', message: 'Informe a data.' });
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      addToast({ type: 'error', message: 'Valor deve ser um número positivo.' });
      return;
    }
    setSubmitting(true);
    createTransaction({
      type: form.type,
      value: amount,
      date: form.date,
      description: form.description || undefined,
      categoryId: form.categoryId,
    })
      .then(({ transaction, budgetExceeded }) => {
        addToast({ type: 'success', message: 'Transação criada com sucesso.' });
        if (budgetExceeded) {
          addToast({
            type: 'warning',
            message: 'Atenção: o orçamento desta categoria para o mês foi ultrapassado.',
          });
        }
        setForm((f) => ({ ...f, amount: '', description: '', categoryId: '' }));
        load();
      })
      .catch((err) => {
        const { message } = parseApiError(err);
        addToast({ type: 'error', message });
      })
      .finally(() => setSubmitting(false));
  };

  const categoryOptions = categories.filter((c) => c.type === form.type);

  if (loading && list.length === 0) return <LoadingState />;
  if (error && list.length === 0) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="page transactions-page">
      <h1>Transações</h1>

      <form className="form form-transaction" onSubmit={handleSubmit}>
        <h2>Nova transação</h2>
        <div className="form-row">
          <label>
            Tipo
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value, categoryId: '' }))}
            >
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </label>
          <label>
            Valor *
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            />
          </label>
          <label>
            Data *
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
          </label>
        </div>
        <div className="form-row">
          <label>
            Categoria *
            <select
              value={form.categoryId}
              onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
              required
            >
              <option value="">Selecione</option>
              {categoryOptions.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>
          <label className="form-full">
            Descrição
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </label>
        </div>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Salvando…' : 'Criar transação'}
        </button>
      </form>

      <section className="list-section">
        <h2>Listagem</h2>
        <div className="list-filters">
          <label>
            Mês
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
            >
              <option value="">Todos</option>
              {[1,2,3,4,5,6,7,8,9,10,11,12].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </label>
          <label>
            Ano
            <input
              type="number"
              min={2020}
              max={2100}
              placeholder="Ano"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
            />
          </label>
        </div>

        {list.length === 0 ? (
          <EmptyState message="Nenhuma transação encontrada." />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {list.map((t) => (
                  <tr key={t.id}>
                    <td>{t.date}</td>
                    <td>{t.description || '—'}</td>
                    <td>{t.category?.name ?? t.categoryId}</td>
                    <td>{t.type === 'receita' ? 'Receita' : 'Despesa'}</td>
                    <td className={t.type === 'despesa' ? 'negative' : 'positive'}>
                      {formatMoney(t.value)}
                    </td>
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
