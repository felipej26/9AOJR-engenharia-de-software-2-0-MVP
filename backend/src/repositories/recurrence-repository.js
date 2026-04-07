const prisma = require('../lib/prisma');

function findActiveDueUntil(userId, untilDate) {
  return prisma.recurrence.findMany({
    where: {
      userId,
      active: true,
      nextRunAt: { lte: untilDate },
    },
    include: { category: true },
  });
}

function updateNextRun(id, nextRunAt) {
  return prisma.recurrence.update({
    where: { id },
    data: { nextRunAt },
  });
}

module.exports = {
  findActiveDueUntil,
  updateNextRun,
};
