jest.mock('../src/repositories/report-repository', () => ({
  getMonthlyReport: jest.fn(),
}));

const reportRepository = require('../src/repositories/report-repository');
const reportService = require('../src/services/report-service');

describe('report-service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('orquestra apenas getMonthlyReport do repositório', async () => {
    const payload = {
      data: {
        month: 7,
        year: 2025,
        totalReceita: 1,
        totalDespesa: 2,
        saldo: -1,
        byCategory: [],
        budgetStatus: [],
      },
    };
    reportRepository.getMonthlyReport.mockResolvedValue(payload);

    const result = await reportService.monthly('user-x', 7, 2025);

    expect(result).toBe(payload);
    expect(reportRepository.getMonthlyReport).toHaveBeenCalledTimes(1);
    expect(reportRepository.getMonthlyReport).toHaveBeenCalledWith('user-x', 7, 2025);
  });

  it('propaga falha do repositório', async () => {
    reportRepository.getMonthlyReport.mockRejectedValue(new Error('falha simulada'));

    await expect(reportService.monthly('user-x', 1, 2026)).rejects.toThrow('falha simulada');
  });
});
