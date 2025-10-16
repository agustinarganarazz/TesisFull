const { connection } = require("../database/config");
const jwt = require("jsonwebtoken");
// Para hashear contraseñas
const bcrypt = require("bcrypt");

const login = async (req, res, next) => {
  const nombre_usuario = req.body.nombre_usuario;
  const clave = req.body.clave;

  connection.query(
    "SELECT * FROM usuarios WHERE nombre_usuario = ?",
    [nombre_usuario],
    async (error, result) => {
      if (error) {
        return next("Error al ejecutar la consulta SQL:", error);
      }

      if (result.length > 0) {
        const usuario = result[0];

        // Verificar la contraseña
        const isValid = await bcrypt.compare(clave, usuario.clave);

        if (!isValid) {
          return res.json({
            success: false,
            mensaje: "Credenciales inválidas",
          });
        }

        // Crear el token JWT
        const token = jwt.sign(
          {
            id: usuario.Id_usuario,
            nombre_usuario: usuario.nombre_usuario,
            rol: usuario.rol_usuario,
          },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({
          success: true,
          token,
          usuario: {
            id: usuario.Id_usuario,
            nombre_usuario: usuario.nombre_usuario,
            rol: usuario.rol_usuario,
          },
        });
      } else {
        res.json({ success: false, mensaje: "Credenciales inválidas" });
      }
    }
  );
};

module.exports = { login };
