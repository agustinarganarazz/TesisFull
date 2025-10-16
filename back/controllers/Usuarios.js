const { connection } = require("../database/config");
const bcrypt = require("bcrypt");

const verUsuarios = (req, res, next) => {
  connection.query(
    "SELECT * FROM usuarios WHERE Estado = 1",
    (error, results) => {
      if (error) return next(error);
      res.json({ message: 'Usuarios obtenidos con éxito', results, status: 200 });
    }
  );
};

const verUsuariosBaja = (req, res, next) => {
  connection.query(
    "SELECT * FROM usuarios WHERE Estado = 0",
    (error, results) => {
      if (error) return next(error);
      res.json({ message: 'Usuarios dados de baja obtenidos con éxito', results, status: 200 });
    }
  );
};

const crearUsuarios = async (req, res, next) => {
  try {
    const { Id_usuario, nombre_usuario, clave, rol_usuario } = req.body;

    // Crear hash de la contraseña
    const saltRounds = 10;
    const hash = await bcrypt.hash(clave, saltRounds);

    connection.query(
      "INSERT INTO usuarios SET ?",
      {
        Id_usuario,
        nombre_usuario,
        clave: hash, // 🔹 guardamos el hash, no la contraseña
        rol_usuario,
      },
      (error, results) => {
        if (error) return next(error);
        res.json({ success: true, results });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, mensaje: "Error al crear usuario" });
  }
};

const editarUsuarios = async (req, res, next) => {
  try {
    const Id_usuario = req.params.Id_usuario;
    const { nombre_usuario, clave, rol_usuario } = req.body;

    // Hash de la nueva contraseña
    const hash = await bcrypt.hash(clave, 10);

    connection.query(
      `UPDATE usuarios SET
        nombre_usuario = ?,
        clave = ?,
        rol_usuario = ?
       WHERE Id_usuario = ?`,
      [nombre_usuario, hash, rol_usuario, Id_usuario],
      (error, results) => {
        if (error) return next(error);
        res.json({ success: true, mensaje: "Usuario editado", status: 200 });
      }
    );
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, mensaje: "Error al editar usuario" });
  }
};

const eliminarUsuarios = (req, res, next) => {
  const Id_usuario = req.params.Id_usuario;
  connection.query(
    "UPDATE usuarios SET Estado = 0 WHERE Id_usuario= ?",
    [Id_usuario],
    (error, results) => {
      if (error) return next(error);
      res.json({ message: 'Usuario eliminado', status: 200 });
    }
  );
};

const altaUsuario = (req, res, next) => {
  const Id_usuario = req.params.Id_usuario;
  connection.query(
    "UPDATE usuarios SET Estado = 1 WHERE Id_usuario = ?",
    [Id_usuario],
    (error, results) => {
      if (error) return next(error);
      res.json({ message: 'Usuario dado de alta', status: 200 });
    }
  );
};  

module.exports = {
  verUsuarios,
  crearUsuarios,
  editarUsuarios,
  eliminarUsuarios,
  verUsuariosBaja,
  altaUsuario,
};
