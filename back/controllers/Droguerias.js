const { connection } = require("../database/config");

const verDroguerias = (req, res) => {
  connection.query(
    "SELECT * FROM droguerias WHERE Estado = 1 ",
    (error, results) => {
      if (error) throw error;
      res.json(results);
    }
  );
};

const crearDroguerias = (req, res, next) => {
  connection.query(
    "INSERT INTO droguerias SET ?",
    {
      nombre_drogueria: req.body.nombre_drogueria,
      Cuit_drogueria: req.body.Cuit_drogueria,
      telefono_drogueria: req.body.telefono_drogueria,
      direccion_drogueria: req.body.direccion_drogueria,
      correo_drogueria: req.body.correo_drogueria,
    },
    (error, results) => {
      if (error) return next(error);
      res.json({ messaje: "Drogueria creada con exito", results, status: 200 });
    }
  );
};

const editarDroguerias = (req, res, next) => {
  const Id_drogueria = req.params.Id_drogueria;
  const {
    nombre_drogueria,
    Cuit_drogueria,
    telefono_drogueria,
    correo_drogueria,
    direccion_drogueria,
  } = req.body;
  connection.query(
    `UPDATE droguerias SET
                            nombre_drogueria=?,
                            Cuit_drogueria=?,
                            telefono_drogueria=?,
                            direccion_drogueria=?,
                            correo_drogueria=?
                            WHERE Id_drogueria=?`,
    [
      nombre_drogueria,
      Cuit_drogueria,
      telefono_drogueria,
      direccion_drogueria,
      correo_drogueria,
      Id_drogueria,
    ],
    (error, results) => {
      if (error) return next(error);
      res.json({ messaje: "Drogueria editada con exito", status: 200 , results});
    }
  );
};

const eliminarDroguerias = (req, res, next) => {
  const Id_drogueria = req.params.Id_drogueria;
  connection.query(
    "UPDATE droguerias SET Estado = 0 WHERE Id_drogueria=" + Id_drogueria,
    (error, results) => {
      if (error) return next(error);
      res.json({ messaje: "Drogueria eliminada con exito", status: 200 , results});
    }
  );
};

module.exports = {
  verDroguerias,
  editarDroguerias,
  crearDroguerias,
  eliminarDroguerias,
};
