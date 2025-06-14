const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use('/backend/storage', express.static(path.join(__dirname, 'storage')));

const registerRouter = require('./api/register');
const superAdminRouter = require('./api/super_admin');
app.use('/api', registerRouter);
app.use('/api', superAdminRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
}); 