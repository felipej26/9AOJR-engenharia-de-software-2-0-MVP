const { mockUserId } = require('../config/env');

const DEFAULT_MOCK_EMAIL = 'usuario@mvp.local';

/**
 * Cria middleware de auth mock (útil para testes ou troca de usuário fixo).
 * @param {{ userId?: string, email?: string }} [options]
 */
function createMockAuthMiddleware(options = {}) {
  const userId = options.userId ?? mockUserId;
  const email = options.email ?? DEFAULT_MOCK_EMAIL;
  return function authMiddleware(req, res, next) {
    req.user = { id: userId, email };
    next();
  };
}

/** MVP: instância padrão; em produção seria substituído por validação JWT. */
const authMock = createMockAuthMiddleware();

module.exports = { createMockAuthMiddleware, authMock };
