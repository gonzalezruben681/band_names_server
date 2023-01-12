//socket.js

const uuid = require('uuid');
const { io } = require("../index");
const Band = require("../models/band");
const Bands = require("../models/bands");
const Voter = require("../models/voter");
const bands = new Bands();

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

  client.on("vote-band", async (payload) => {
    try {
        // buscar un votante con ese nombre
        let voter = await Voter.findOne({ voterName: payload.voterName });
        console.log(payload.voterName);
        if (!voter) {
            // si no existe, crear un nuevo registro de votante
            voter = new Voter({ 
                voterName: payload.voterName,
                voterId: uuid.v4() // utilizando la librería uuid para generar un id único
            });
            await voter.save();
        } else {
            // si ya existe, emitir un error
            client.emit("vote-error", `Lo siento, ${payload.voterName}, ya has votado anteriormente`);
            return;
        }
        // buscar la banda correspondiente y incrementar su contador de votos
        const band = await Band.findByIdAndUpdate(
            payload.id,
            { $inc: { votes: 1 } },
            { new: true }
        );
        // Emitir bandas actualizadas a todos los clientes
        const bands = await Band.find();
        io.emit("active-bands", bands);
    } catch (err) {
        console.log(err);
    }
});

client.on('reset-votes', async() => {
  try {
      //actualizar todos los registros de banda para establecer el campo votes en 0
      await Band.updateMany({}, { $set: { votes: 0 } });
      //obtener todas las bandas actualizadas
      const bands = await Band.find();
      io.emit('active-bands', bands);
  } catch(err) {
      console.log(err);
  }
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
      if (err) {
        console.log(err);
        return;
      }

      // Emitir bandas actualizadas a todos los clientes
      Band.find((err, bands) => {
        if (err) {
          console.log(err);
          return;
        }
        io.emit("active-bands", bands);
      });
    });
  });

  client.on("delete-voter", async (voterName) => {
    try {
        await Voter.findOneAndDelete({ voterName });
        // emitir un evento al cliente para actualizar la interfaz de usuario
        io.emit("voter-deleted", voterName);
    } catch (err) {
        console.log(err);
    }
});

client.on("delete-all-voters", async () => {
  try {
      // eliminar todos los registros de votantes
      await Voter.deleteMany();
      // emitir un evento al cliente para actualizar la interfaz de usuario
      io.emit("all-voters-deleted");
  } catch (err) {
      console.log(err);
  }
});


});
