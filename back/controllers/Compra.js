const { connection } = require("../database/config");

const registrarCompraYLote = (req, res, next) => {
  // Paso 1: insertar sin Nro_comprobante
  connection.query(
    "INSERT INTO COMPRA SET ?",
    {
      descripcion_compra: req.body.descripcion_compra,
      Id_drogueria: req.body.Id_drogueria,
      Id_metodoPago: req.body.Id_metodoPago,
      Total: req.body.Total,
      Estado: 1,
    },
    (error, results) => {
      if (error) return next(error);
      const insertId = results.insertId;
      const nroComprobante = insertId.toString().padStart(5, "0"); // Formato: "00001"

      // Paso 2: actualizar con el número generado
      connection.query(
        "UPDATE COMPRA SET Nro_comprobante = ? WHERE Id_compra = ?",
        [nroComprobante, insertId],
        (error) => {
          if (error) return next(error);
          res.json({
            messaje: "Compra registrada con exito",
            insertId,
            nroComprobante,
            status: 200,
          });
        }
      );
    }
  );
};

module.exports = { registrarCompraYLote };
