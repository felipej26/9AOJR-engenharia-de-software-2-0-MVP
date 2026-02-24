export default function EmptyState({ message = 'Nenhum registro encontrado.' }) {
  return (
    <div className="empty-state" style={{ padding: 24, textAlign: 'center', color: '#6c757d' }}>
      {message}
    </div>
  );
}
