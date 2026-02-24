#!/usr/bin/env node
const { execSync } = require('child_process');
require('dotenv').config();

function run(cmd) {
  console.log('>', cmd);
  execSync(cmd, { stdio: 'inherit' });
}

run('npx prisma db push');
run('node prisma/seed.js');
console.log('Banco inicializado e seed aplicado.');
