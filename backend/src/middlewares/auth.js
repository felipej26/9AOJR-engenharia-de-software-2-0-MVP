const { mockUserId } = require('../config/env');

/**
 * MVP: middleware de auth mock. Define req.user com usuário fixo.
 * Em produção seria substituído por validação JWT.
 */
function authMock(req, res, next) {
  req.user = {
    id: mockUserId,
    email: 'usuario@mvp.local',
  };
  next();
}

module.exports = { authMock };
