const mongoose = require('mongoose');

const autenticadorSchema = new mongoose.Schema({
  servicio: {
    type: String,
    required: true
  },

  usuario: {
    type: String,
    required: false,
    default: ''
  },

  secret: {
    type: String,
    required: true
  },

  pin: {
    type: String,
    default: ''
  },

  estado: {
    type: String,
    default: 'pendiente'
  },

  fecha: {
    type: String,
    required: true
  }

}, {
  collection: 'autenticadores'
});

module.exports = mongoose.model('Autenticador', autenticadorSchema);