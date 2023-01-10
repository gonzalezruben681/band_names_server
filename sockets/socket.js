const mongoose = require("mongoose");
const Band = require('../models/band');
const { io } = require("../index");

// Mensajes de Sockets
io.on("connection", (client) => {
  console.log("Cliente conectado");

  // Enviar bandas activas al cliente cuando se conecte
  Band.find((err, bands) => {
    client.emit("active-bands", bands);
  });

  client.on("disconnect", () => {
    console.log("Cliente desconectado");
  });

  client.on('vote-band', (payload) => {
    // Incrementar votos de la banda y guardar
    Band.findOneAndUpdate({ _id: payload.id }, { $inc: { votes: 1 } }, { new: true }, (err, band) => {
        if (err) {
            console.log(err);
            return;
        }
        // Emitir bandas actualizadas a todos los clientes
        Band.find((err, bands) => {
            if (err) {
                console.log(err);
            }
            io.emit('active-bands', bands);
        });
    });
});

  client.on("add-band", (payload) => {
    // Crear nueva banda y guardar
    const newBand = new Band({ name: payload.name, votes: 0 });
    newBand.save((err, band) => {
      // Emitir bandas actualizadas a todos los clientes
      Band.find((err, bands) => {
        io.emit("active-bands", bands);
      });
    });
  });

  client.on("delete-band", (payload) => {
    // Eliminar banda
    Band.findOneAndDelete({ _id: payload.id }, (err, band) => {
      // Emitir bandas actualizadas a todos los clientes
      Band.find((err, bands) => {
        io.emit("active-bands", bands);
      });
    });
  });
});
