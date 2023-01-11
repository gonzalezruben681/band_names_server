//bands.js
const Band = require("./band");
const uuid = require("uuid");

const Voter = require("../models/voter");

class Bands {
  constructor() {}

  addBand(band) {
    // Crear nueva banda y guardar
    const newBand = new Band({ name: band.name, votes: 0 });
    newBand.save((err, band) => {
      // manejar errores aquí
      if (err) {
        console.log(err);
      }
    });
  }

  getBands() {
    // Recuperar todas las bandas de la base de datos
    Band.find((err, bands) => {
      if (err) {
        console.log(err);
      }
      return bands;
    });
  }

  deleteBand(id) {
    // Eliminar banda
    Band.findOneAndDelete({ _id: id }, (err, band) => {
      // manejar errores aquí
      if (err) {
        console.log(err);
      }
    });
  }

  async voteBand(bandId, voterId) {
    try {    
      // check if voterId already exists in voter collection
      const voter = await Voter.findOne({ voterId });
      if (voter) {
        return new Error("voterId already used");
      }
  
      const band = await Band.findByIdAndUpdate(
        bandId,
        { $inc: { votes: 1 } },
        { new: true }
      );
  
      // create a new voter
      const newVoter = new Voter({
        voterId,
      });
      await newVoter.save();
      return band;
    }
    catch (error) {
      console.log(`El error: ${error}`);
    }
  }

  async getBands() {
    return await Band.find();
  }
}

module.exports = Bands;
