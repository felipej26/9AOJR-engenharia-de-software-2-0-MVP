const { errorHandler } = require('../src/middlewares/error-handler');
const { HttpError } = require('../src/errors/http-error');

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('errorHandler com HttpError', () => {
  const req = {};
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('responde com status e corpo no contrato existente (sem code)', () => {
    const res = mockRes();
    const err = new HttpError(404, 'Categoria não encontrada');

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Categoria não encontrada' });
  });

  it('inclui code no JSON quando presente', () => {
    const res = mockRes();
    const err = new HttpError(400, 'Inválido', 'BAD_REQUEST');

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Inválido', code: 'BAD_REQUEST' });
  });

  it('usa status 500 para Error genérico sem statusCode', () => {
    const res = mockRes();

    errorHandler(new Error('falha'), req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'falha' });
  });

  it('aceita err.status legado quando statusCode ausente', () => {
    const res = mockRes();
    const err = new Error('Legado');
    err.status = 418;

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(418);
    expect(res.json).toHaveBeenCalledWith({ error: 'Legado' });
  });
});
