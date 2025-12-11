// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

//Import Routes
const authRoutes = require('./src/routes/authRoutes');
const serviceRoutes = require('./src/routes/serviceRoutes');
const scheduleRoutes = require('./src/routes/scheduleRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

//Routes definition
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/schedules', scheduleRoutes);

//Simple route to test server
app.get('/', (req, res) => {
    res.send('API SaaS Agendamento rodando!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});