const express = require('express');
const app = express(); // App de Express
const path = require('path');
require('dotenv').config();

// Node server
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);
require('./sockets/socket');

// Path público
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

// Realiza cualquier configuración de tu aplicación Express aquí
server.listen(process.env.PORT, (err) => {
    if(err) throw new Error(err);
    console.log('Servidor escuchando en el puerto', process.env.PORT);
});

