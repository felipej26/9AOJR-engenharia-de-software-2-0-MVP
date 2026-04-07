const app = require('./app');
const { port, mockUserId } = require('./config/env');
const { registerShutdownHooks } = require('./lib/prisma');

registerShutdownHooks();

const server = app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
  console.log(`Mock user ID: ${mockUserId}`);
});

module.exports = server;
