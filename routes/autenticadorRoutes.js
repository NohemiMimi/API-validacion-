const express = require('express');
const router = express.Router();

const {
  obtenerAutenticadores,
  crearAutenticador,
  eliminarAutenticador,
  revocarAutenticador
} = require('../controllers/autenticadorController');

// Obtener todos
router.get('/', obtenerAutenticadores);

// Crear uno nuevo
router.post('/', crearAutenticador);

// Revocar
router.patch('/:id/revocar', revocarAutenticador);

// Eliminar un autenticador
router.delete('/:id', eliminarAutenticador);

module.exports = router;