/**
 * Middleware central de erro. Formata resposta no padrão do projeto.
 */
function errorHandler(err, req, res, _next) {
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Erro interno do servidor';
  const code = err.code || undefined;

  res.status(status).json({
    error: message,
    ...(code && { code }),
  });
}

module.exports = { errorHandler };
