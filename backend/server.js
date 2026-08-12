/* ============================================
   JMB FREIGHT - BACKEND SERVER
   Servidor Node.js con Express
   ============================================ */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// ----- MIDDLEWARE -----
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos del frontend
app.use(express.static('frontend'));

// ----- CONFIGURACIÓN DE CORREO (Nodemailer) -----
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// ----- RUTA PARA ENVIAR CORREO DE CONTACTO -----
app.post('/api/contact', async (req, res) => {
    const { name, email, phone, service, message } = req.body;

    // Validaciones básicas
    if (!name || !email || !phone || !message) {
        return res.status(400).json({
            success: false,
            error: 'Todos los campos obligatorios deben ser llenados.'
        });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            error: 'El formato del correo no es válido.'
        });
    }

    try {
        // Configuración del correo
        const mailOptions = {
            from: `"JMB Freight Web" <${process.env.SMTP_USER}>`,
            to: process.env.CONTACT_EMAIL || 'contacto@jmbfreight.mx',
            replyTo: email,
            subject: `Nueva Cotización - ${name}`,
            text: `
                📋 NUEVA SOLICITUD DE COTIZACIÓN
                
                👤 Nombre: ${name}
                📧 Correo: ${email}
                📱 Teléfono: ${phone}
                🚚 Servicio: ${service || 'No especificado'}
                
                📝 Mensaje:
                ${message}
                
                ---
                Este mensaje fue enviado desde el formulario de contacto de JMB Freight.
            `,
            html: `
                <h2>📋 Nueva Solicitud de Cotización</h2>
                
                <table style="width:100%; border-collapse: collapse;">
                    <tr><td style="padding:8px 0;"><strong>👤 Nombre:</strong></td><td>${name}</td></tr>
                    <tr><td style="padding:8px 0;"><strong>📧 Correo:</strong></td><td><a href="mailto:${email}">${email}</a></td></tr>
                    <tr><td style="padding:8px 0;"><strong>📱 Teléfono:</strong></td><td><a href="tel:${phone}">${phone}</a></td></tr>
                    <tr><td style="padding:8px 0;"><strong>🚚 Servicio:</strong></td><td>${service || 'No especificado'}</td></tr>
                </table>
                
                <h3>📝 Mensaje:</h3>
                <p style="background:#f5f5f5; padding:15px; border-radius:8px;">${message.replace(/\n/g, '<br>')}</p>
                
                <hr style="margin:20px 0;">
                <small style="color:#666;">Este mensaje fue enviado desde el formulario de contacto de JMB Freight.</small>
            `
        };

        // Enviar correo
        await transporter.sendMail(mailOptions);

        // También enviar una copia al usuario
        const userMailOptions = {
            from: `"JMB Freight" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `JMB Freight - Hemos recibido tu solicitud`,
            text: `
                Hola ${name},
                
                Gracias por contactar a JMB Freight. Hemos recibido tu solicitud de cotización y nuestro equipo la revisará a la brevedad.
                
                Resumen de tu solicitud:
                - Servicio: ${service || 'No especificado'}
                - Mensaje: ${message}
                
                Te contactaremos muy pronto.
                
                Saludos cordiales,
                El equipo de JMB Freight
            `,
            html: `
                <h2>¡Hola ${name}!</h2>
                <p>Gracias por contactar a <strong>JMB Freight</strong>. Hemos recibido tu solicitud de cotización y nuestro equipo la revisará a la brevedad.</p>
                
                <h3>📋 Resumen de tu solicitud:</h3>
                <ul>
                    <li><strong>Servicio:</strong> ${service || 'No especificado'}</li>
                </ul>
                <p><strong>Mensaje:</strong> ${message}</p>
                
                <p>Te contactaremos muy pronto.</p>
                <br>
                <p>Saludos cordiales,<br><strong>El equipo de JMB Freight</strong></p>
            `
        };

        await transporter.sendMail(userMailOptions);

        return res.status(200).json({
            success: true,
            message: 'Correo enviado exitosamente'
        });

    } catch (error) {
        console.error('Error al enviar correo:', error);
        return res.status(500).json({
            success: false,
            error: 'Error al enviar el correo. Por favor, intenta de nuevo.'
        });
    }
});

// ----- RUTA DE PRUEBA -----
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ----- INICIAR SERVIDOR -----
app.listen(PORT, () => {
    console.log(`✅ Servidor JMB Freight corriendo en http://localhost:${PORT}`);
    console.log(`📧 Correos enviados desde: ${process.env.SMTP_USER || 'No configurado'}`);
    console.log(`📬 Correos receptores: ${process.env.CONTACT_EMAIL || 'contacto@jmbfreight.mx'}`);
});