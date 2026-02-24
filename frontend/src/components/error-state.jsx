export default function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state" style={{ padding: 24, textAlign: 'center' }}>
      <p style={{ color: '#721c24', marginBottom: 12 }}>{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn btn-secondary">
          Tentar novamente
        </button>
      )}
    </div>
  );
}
