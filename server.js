require('dotenv').config();
const app = require('./src/app');
const { syncDB } = require('./src/models');

const PORT = process.env.PORT || 3000;

const start = async () => {
  await syncDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start();