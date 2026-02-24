const { z } = require('zod');

const transactionCreateSchema = z.object({
  value: z.coerce.number().positive('Valor deve ser positivo'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (YYYY-MM-DD)'),
  description: z.string().optional(),
  type: z.enum(['receita', 'despesa']),
  categoryId: z.string().uuid('categoryId inválido'),
});

const categoryCreateSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  type: z.enum(['receita', 'despesa']),
});

const budgetCreateSchema = z.object({
  categoryId: z.string().uuid('categoryId inválido'),
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2020).max(2100),
  amount: z.coerce.number().positive('Valor do orçamento deve ser positivo'),
});

const reportMonthlySchema = z.object({
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2020).max(2100),
});

module.exports = {
  transactionCreateSchema,
  categoryCreateSchema,
  budgetCreateSchema,
  reportMonthlySchema,
};
