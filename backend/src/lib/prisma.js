const { PrismaClient } = require('@prisma/client');

const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

async function disconnectPrisma() {
  await prisma.$disconnect();
  if (process.env.NODE_ENV !== 'production' && globalForPrisma.prisma === prisma) {
    delete globalForPrisma.prisma;
  }
}

function registerShutdownHooks() {
  const shutdown = async () => {
    try {
      await disconnectPrisma();
    } finally {
      process.exit(0);
    }
  };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}

module.exports = prisma;
module.exports.disconnectPrisma = disconnectPrisma;
module.exports.registerShutdownHooks = registerShutdownHooks;
