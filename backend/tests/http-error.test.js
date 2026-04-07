const { HttpError } = require('../src/errors/http-error');

describe('HttpError', () => {
  it('define statusCode e message', () => {
    const err = new HttpError(404, 'Não encontrado');
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(HttpError);
    expect(err.name).toBe('HttpError');
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe('Não encontrado');
  });

  it('inclui code apenas quando informado', () => {
    const without = new HttpError(400, 'Bad');
    expect(without).not.toHaveProperty('code');

    const withCode = new HttpError(400, 'Bad', 'VALIDATION');
    expect(withCode.code).toBe('VALIDATION');
  });
});
