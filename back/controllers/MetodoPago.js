const { connection } = require("../database/config.js");

const verMetodoPago = (req, res, next) => {
  connection.query(
    "SELECT * FROM metodopago WHERE Estado = 1",
    (error, results) => {
      if (error) return next(error);
      res.json({
        messaje: "Metodos de pago obtenidos con exito",
        results,
        status: 200,
      });
    }
  );
};

const crearMetodo = (req, res, next) => {
  connection.query(
    "INSERT INTO metodopago SET ?",
    {
      Id_metodoPago: req.body.Id_metodoPago,
      nombre_metodopago: req.body.nombre_metodopago,
    },
    (error, results) => {
      if (error) return next(error);
      res.json({
        messaje: "Metodo de pago creado con exito",
        results,
        status: 200,
      });
    }
  );
};

const editarMetodo = (req, res, next) => {
  const Id_metodoPago = req.params.Id_metodoPago;
  const { nombre_metodopago } = req.body;
  connection.query(
    `UPDATE metodopago SET
                                          nombre_metodopago = ?
                                          WHERE Id_metodoPago = ?`,
    [nombre_metodopago, Id_metodoPago],
    (error, results) => {
      if (error) return next(error);
      res.json({
        messaje: "Metodo de pago editado con exito",
        status: 200,
        results,
      });
    }
  );
};

const eliminarMetodo = (req, res, next) => {
  const Id_metodoPago = req.params.Id_metodoPago;
  connection.query(
    "UPDATE metodopago SET Estado = 0 WHERE Id_metodoPago= ?",
    [Id_metodoPago],
    (error, results) => {
      if (error) return next(error);
      res.json({
        messaje: "Metodo de pago eliminado con exito",
        status: 200,
        results,
      });
    }
  );
};

module.exports = { verMetodoPago, crearMetodo, editarMetodo, eliminarMetodo };
