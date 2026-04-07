/**
 * Factory do cliente Prisma usado em jest.mock('../src/lib/prisma', ...).
 * Mantém a mesma forma do singleton real (models + disconnect/register).
 * Não conecta ao banco — apenas jest.fn() para testes isolados.
 */
function createPrismaMock() {
  return {
    category: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
    },
    transaction: {
      create: jest.fn(),
      findMany: jest.fn(),
      aggregate: jest.fn(),
      findFirst: jest.fn(),
    },
    budget: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    recurrence: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
    disconnectPrisma: jest.fn(),
    registerShutdownHooks: jest.fn(),
  };
}

module.exports = { createPrismaMock };
