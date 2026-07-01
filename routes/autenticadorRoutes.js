const express = require('express');
const router = express.Router();

const {
  obtenerAutenticadores,
  crearAutenticador,
  guardarPIN,
  verificarPIN,
  eliminarAutenticador,
  revocarAutenticador
} = require('../controllers/autenticadorController');

// ==========================
// Obtener todos
// ==========================
router.get('/', obtenerAutenticadores);

// ==========================
// Crear autenticador
// ==========================
router.post('/', crearAutenticador);

// ==========================
// Guardar PIN
// ==========================
router.patch('/:id/pin', guardarPIN);

// ==========================
// Verificar PIN
// ==========================
router.post('/verificar-pin', verificarPIN);

// ==========================
// Revocar autenticador
// ==========================
router.patch('/:id/revocar', revocarAutenticador);

// ==========================
// Eliminar autenticador
// ==========================
router.delete('/:id', eliminarAutenticador);

module.exports = router;