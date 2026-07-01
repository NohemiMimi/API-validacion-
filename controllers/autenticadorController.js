const Autenticador = require('../models/Autenticador');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// ==========================
// Obtener todos
// ==========================
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

// ==========================
// Crear autenticador
// ==========================
const crearAutenticador = async (req, res) => {

    try {

        const { servicio, usuario } = req.body;

        // Generar secret TOTP
        const secret = speakeasy.generateSecret({
            length: 20
        });

        const fecha = new Date().toISOString();

        // Crear registro
        const nuevoAutenticador = new Autenticador({

            servicio,
            usuario,
            secret: secret.base32,
            pin: '',
            estado: 'pendiente',
            fecha

        });

        await nuevoAutenticador.save();

        // URI personalizada con id
        const otpAuthUrl =
            `otpauth://totp/${encodeURIComponent(servicio)}:${encodeURIComponent(usuario)}` +
            `?secret=${secret.base32}` +
            `&issuer=${encodeURIComponent(servicio)}` +
            `&id=${nuevoAutenticador._id}`;

        const qr = await QRCode.toDataURL(otpAuthUrl);

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

// ==========================
// Guardar PIN
// ==========================
const guardarPIN = async (req, res) => {

    try {

        const { id } = req.params;
        const { pin } = req.body;

        if (!pin) {

            return res.status(400).json({
                mensaje: 'El PIN es obligatorio'
            });

        }

        const autenticador = await Autenticador.findById(id);

        if (!autenticador) {

            return res.status(404).json({
                mensaje: 'Autenticador no encontrado'
            });

        }

        autenticador.pin = pin;
        autenticador.estado = 'activo';

        await autenticador.save();

        res.json({

            mensaje: 'PIN guardado correctamente',

            autenticador

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error del servidor'
        });

    }

};

// ==========================
// Verificar PIN
// ==========================
const verificarPIN = async (req, res) => {

    try {

        const { id, pin } = req.body;

        const autenticador = await Autenticador.findById(id);

        if (!autenticador) {

            return res.status(404).json({
                mensaje: 'Autenticador no encontrado'
            });

        }

        if (autenticador.estado === 'revocado') {

            return res.status(403).json({

                valido: false,

                mensaje: 'El autenticador fue revocado'

            });

        }

        if (autenticador.pin !== pin) {

            return res.json({

                valido: false,

                mensaje: 'PIN incorrecto'

            });

        }

        res.json({

            valido: true,

            mensaje: 'PIN correcto',

            autenticador

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error del servidor'
        });

    }

};

// ==========================
// Revocar autenticador
// ==========================
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

// ==========================
// Eliminar autenticador
// ==========================
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

module.exports = {

    obtenerAutenticadores,
    crearAutenticador,
    guardarPIN,
    verificarPIN,
    eliminarAutenticador,
    revocarAutenticador

};