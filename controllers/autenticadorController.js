const Autenticador = require('../models/Autenticador');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// Obtener todos los autenticadores
const obtenerAutenticadores = async (req, res) => {
    try {

        const autenticadores = await Autenticador.find();

        res.json(autenticadores);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error del servidor'
        });

    }
};

// Crear un autenticador
const crearAutenticador = async (req, res) => {

    try {

        const { servicio, usuario } = req.body;

        // Generar secret para TOTP
        const secret = speakeasy.generateSecret({
            name: `${servicio} (${usuario})`
        });

        // Generar QR en Base64
        const qr = await QRCode.toDataURL(secret.otpauth_url);

        // Crear fecha actual
        const fecha = new Date().toISOString();

        const nuevoAutenticador = new Autenticador({

            servicio,
            usuario,
            secret: secret.base32,
            pin: '',
            estado: 'pendiente',
            fecha

        });

        await nuevoAutenticador.save();

        res.status(201).json({

            mensaje: 'Autenticador creado correctamente',

            autenticador: nuevoAutenticador,

            qr

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error del servidor'
        });

    }

};

// Eliminar autenticador
const eliminarAutenticador = async (req, res) => {

    try {

        const { id } = req.params;

        const autenticador = await Autenticador.findByIdAndDelete(id);

        if (!autenticador) {
            return res.status(404).json({
                mensaje: 'Autenticador no encontrado'
            });
        }

        res.json({
            mensaje: 'Autenticador eliminado correctamente'
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error del servidor'
        });

    }

};

// Revocar autenticador
const revocarAutenticador = async (req, res) => {

    try {

        const { id } = req.params;

        const autenticador = await Autenticador.findById(id);

        if (!autenticador) {
            return res.status(404).json({
                mensaje: 'Autenticador no encontrado'
            });
        }

        autenticador.estado = 'revocado';

        await autenticador.save();

        res.json({
            mensaje: 'Autenticador revocado correctamente',
            autenticador
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error del servidor'
        });

    }

};

module.exports = {
    obtenerAutenticadores,
    crearAutenticador,
    eliminarAutenticador,
    revocarAutenticador
};