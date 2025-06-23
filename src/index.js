const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const transferRoutes = require('./routes/transferRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const basesRoutes = require('./routes/basesRoutes');
const assetRoutes = require('./routes/assetRoutes');

const app = express();
app.use(cors({
  origin: 'https://military-asset-management-system-fr.vercel.app',
  credentials: true
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use('/api/auth', authRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/bases', basesRoutes);
app.use('/api/assets', assetRoutes);

app.get('/', (req, res) => {
  res.send('API working');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
