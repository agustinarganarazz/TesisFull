const { connection } = require("../database/config");

const verCategoria = (req, res, next) => {
  connection.query("SELECT * FROM categoria WHERE Estado = 1", (error, results) => {
    if (error) return next(error);
    res.json({ message: "Categoria obtenida con exito", results });
  });
};

const crearCategoria = (req, res, next) => {
  connection.query(
    "INSERT INTO categoria SET ?",
    {
      nombre_categoria: req.body.nombre_categoria,
    },
    (error, results) => {
      if (error) return next(error);
      res.json({ message: "Categoria creada con exito" , result: results , status: 200});
    }
  );
};

const editarCategoria = (req, res, next) => {
  const Id_categoria = req.params.Id_categoria;
  const { nombre_categoria } = req.body;
  connection.query(
    "UPDATE categoria SET nombre_categoria = ? WHERE Id_categoria = ?",
    [nombre_categoria, Id_categoria],
    (error, results) => {
      if (error) return next(error);
      res.json({ message: "registro editado" , result: results , status: 200});
    }
  );
};

const eliminarCategoria = (req, res, next) => {
    const Id_categoria = req.params.Id_categoria;
    connection.query(
        'UPDATE categoria SET Estado = 0 WHERE Id_categoria = ?',
        [Id_categoria],
        (error, results) => {
            if (error) return next(error);
            res.json({ message: 'Categoria eliminada con exito', result: results, status: 200 });
        }
    );
};
module.exports = { verCategoria, crearCategoria, editarCategoria, eliminarCategoria };
