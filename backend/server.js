const express = require('express');
const cors = require('cors');
const patientRoutes = require('./routes/patients');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/patients', patientRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Brain Tumor Detection API' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});