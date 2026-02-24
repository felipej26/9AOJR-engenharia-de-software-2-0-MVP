const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const MOCK_USER_ID = process.env.MOCK_USER_ID || '00000000-0000-0000-0000-000000000001';

const categories = [
  { name: 'Salário', type: 'receita' },
  { name: 'Freelance', type: 'receita' },
  { name: 'Alimentação', type: 'despesa' },
  { name: 'Transporte', type: 'despesa' },
  { name: 'Moradia', type: 'despesa' },
  { name: 'Saúde', type: 'despesa' },
  { name: 'Educação', type: 'despesa' },
  { name: 'Lazer', type: 'despesa' },
];

async function main() {
  const prisma = new PrismaClient();
  const user = await prisma.user.upsert({
    where: { id: MOCK_USER_ID },
    update: {},
    create: {
      id: MOCK_USER_ID,
      email: 'usuario@mvp.local',
      passwordHash: null,
    },
  });
  console.log('Usuário mock:', user.email);

  const existing = await prisma.category.findMany({
    where: { userId: user.id },
    select: { name: true, type: true },
  });
  const existingKeys = new Set(existing.map((c) => `${c.name}|${c.type}`));

  for (const cat of categories) {
    if (existingKeys.has(`${cat.name}|${cat.type}`)) continue;
    await prisma.category.create({
      data: {
        userId: user.id,
        name: cat.name,
        type: cat.type,
      },
    });
    existingKeys.add(`${cat.name}|${cat.type}`);
  }
  const count = await prisma.category.count({ where: { userId: user.id } });
  console.log(`Categorias no total: ${count}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
