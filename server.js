require('dotenv').config();

const express = require('express');
const cors = require('cors');

const conectarDB = require('./config/database');

// Rutas
const autenticadorRoutes = require('./routes/autenticadorRoutes');

const app = express();

// Conectar a MongoDB
conectarDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
  res.send('API funcionando');
});

// Rutas de la API
app.use('/api/autenticadores', autenticadorRoutes);

// Puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});