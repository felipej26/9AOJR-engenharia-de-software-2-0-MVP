import { useState } from 'react';
import { getCategories, createCategory } from '../services/categories-service';
import { useToast } from '../context/toast-context';
import { parseApiError } from '../utils/parse-api-error';
import { useAsyncResource } from '../hooks/use-async-resource';
import LoadingState from '../components/loading-state';
import ErrorState from '../components/error-state';
import EmptyState from '../components/empty-state';
import {
  DEFAULT_TRANSACTION_TYPE,
  getTransactionTypeLabel,
  TRANSACTION_TYPE_OPTIONS,
} from '../constants/transaction-types';

export default function CategoriesPage() {
  const { data: list, loading, error, reload: load } = useAsyncResource(
    () => getCategories().then((data) => (Array.isArray(data) ? data : [])),
    [],
  );
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', type: DEFAULT_TRANSACTION_TYPE });
  const { addToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = (form.name || '').trim();
    if (!name) {
      addToast({ type: 'error', message: 'Nome da categoria é obrigatório.' });
      return;
    }
    setSubmitting(true);
    createCategory({ name, type: form.type })
      .then(() => {
        addToast({ type: 'success', message: 'Categoria criada com sucesso.' });
        setForm({ name: '', type: DEFAULT_TRANSACTION_TYPE });
        load();
      })
      .catch((err) => {
        addToast({ type: 'error', message: parseApiError(err).message });
      })
      .finally(() => setSubmitting(false));
  };

  const items = list ?? [];
  if (loading && items.length === 0) return <LoadingState />;
  if (error && items.length === 0) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="page categories-page">
      <h1>Categorias</h1>

      <form className="form form-category" onSubmit={handleSubmit}>
        <h2>Nova categoria</h2>
        <div className="form-row">
          <label>
            Nome *
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </label>
          <label>
            Tipo
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            >
              {TRANSACTION_TYPE_OPTIONS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </label>
        </div>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Salvando…' : 'Criar categoria'}
        </button>
      </form>

      <section className="list-section">
        <h2>Listagem</h2>
        {items.length === 0 ? (
          <EmptyState message="Nenhuma categoria. Crie uma para usar em transações." />
        ) : (
          <ul className="category-list">
            {items.map((c) => (
              <li key={c.id}>
                <span className="category-name">{c.name}</span>
                <span className="category-type">{getTransactionTypeLabel(c.type)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
