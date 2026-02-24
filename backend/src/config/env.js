require('dotenv').config();

module.exports = {
  port: parseInt(process.env.PORT || '3001', 10),
  mockUserId: process.env.MOCK_USER_ID || '00000000-0000-0000-0000-000000000001',
};
