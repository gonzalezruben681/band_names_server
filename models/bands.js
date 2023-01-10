const Band = require("./band");

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

  voteBand(id) {
    // Incrementar votos de la banda y guardar
    Band.findOneAndUpdate({ _id: id }, { $inc: { votes: 1 } }, (err, band) => {
      // manejar errores aquí
      if (err) {
        console.log(err);
      }
    });
  }
}

module.exports = Bands;
