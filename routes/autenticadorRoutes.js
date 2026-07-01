const express = require('express');
const router = express.Router();

const {
  obtenerAutenticadores,
  crearAutenticador,
  guardarPIN,
  verificarPIN,
  generarTOTP,
  verificarTOTP,
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
// Generar código TOTP
// ==========================
router.post('/generar-totp', generarTOTP);

// ==========================
// Verificar código TOTP
// ==========================
router.post('/verificar-totp', verificarTOTP);

// ==========================
// Revocar autenticador
// ==========================
router.patch('/:id/revocar', revocarAutenticador);

// ==========================
// Eliminar autenticador
// ==========================
router.delete('/:id', eliminarAutenticador);

module.exports = router;