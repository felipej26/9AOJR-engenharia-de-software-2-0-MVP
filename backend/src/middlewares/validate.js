/**
 * Middleware de validação com Zod. Recebe um schema e valida req.body ou req.query.
 */
function validate(schema, source = 'body') {
  return (req, res, next) => {
    const data = source === 'query' ? req.query : req.body;
    const result = schema.safeParse(data);
    if (!result.success) {
      const first = result.error.errors[0];
      const message = first ? `${first.path.join('.')}: ${first.message}` : 'Dados inválidos';
      return res.status(400).json({ error: message, code: 'VALIDATION_ERROR' });
    }
    req.validated = result.data;
    next();
  };
}

module.exports = { validate };
