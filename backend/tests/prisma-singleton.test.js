describe('Prisma singleton', () => {
  let prismaClientSpy;

  beforeEach(() => {
    delete globalThis.prisma;
    jest.resetModules();

    const prismaPackage = require('@prisma/client');
    prismaClientSpy = jest.spyOn(prismaPackage, 'PrismaClient').mockImplementation(function mockClient() {
      return {
        user: {},
        category: {},
        transaction: {},
        budget: {},
        recurrence: {},
        $disconnect: jest.fn().mockResolvedValue(undefined),
      };
    });
  });

  afterEach(() => {
    prismaClientSpy.mockRestore();
    delete globalThis.prisma;
  });

  it('instancia PrismaClient uma única vez ao carregar lib e vários repositórios/services', () => {
    require('../src/lib/prisma');
    require('../src/repositories/transaction-repository');
    require('../src/repositories/category-repository');
    require('../src/repositories/budget-repository');
    require('../src/repositories/recurrence-repository');
    require('../src/repositories/report-repository');
    require('../src/services/report-service');

    expect(prismaClientSpy).toHaveBeenCalledTimes(1);
  });

  it('reutiliza a mesma instância exportada por lib/prisma', () => {
    const prismaA = require('../src/lib/prisma');
    const prismaB = require('../src/lib/prisma');
    expect(prismaA).toBe(prismaB);
    expect(prismaClientSpy).toHaveBeenCalledTimes(1);
  });
});
