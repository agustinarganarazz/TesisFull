const { connection } = require("../database/config.js");

const verClientes = (req, res, next) => {
  connection.query(
    "SELECT * FROM clientes WHERE Estado = 1",
    (error, results) => {
      if (error) return next(error);
      res.json({
        messaje: "Clientes obtenidos con exito",
        results,
        status: 200,
      });
    }
  );
};

const crearClientes = (req, res, next) => {
  connection.query(
    "INSERT INTO clientes SET ?",
    {
      Id_cliente: req.body.Id_cliente,
      nombre_cliente: req.body.nombre_cliente,
      apellido_cliente: req.body.apellido_cliente,
      telefono_cliente: req.body.telefono_cliente,
      domicilio_cliente: req.body.domicilio_cliente,
      documento_cliente: req.body.documento_cliente,
      monto_credito: req.body.monto_credito,
      limite_credito: req.body.limite_credito,
    },
    (error, results) => {
      if (error) return next(error);
      res.json({
        message: "Cliente creado con éxito",
        results,
        status: 201,
      });
    }
  );
};

const editarClientes = (req, res, next) => {
  const Id_cliente = req.params.Id_cliente;
  const {
    nombre_cliente,
    apellido_cliente,
    telefono_cliente,
    domicilio_cliente,
    documento_cliente,
    monto_credito,
    limite_credito,
  } = req.body;
  connection.query(
    `UPDATE clientes SET
                        nombre_cliente=?,
                        apellido_cliente=?,
                        telefono_cliente=?,
                        domicilio_cliente=?,
                        documento_cliente=?,
                        monto_credito=?,
                        limite_credito=?

                        WHERE Id_cliente = ${Id_cliente}`,
    [
      nombre_cliente,
      apellido_cliente,
      telefono_cliente,
      domicilio_cliente,
      documento_cliente,
      monto_credito,
      limite_credito,
    ],
    (error, results) => {
      if (error) return next(error);
      res.json({
        message: "Cliente editado con éxito",
        results,
        status: 200,
      });
    }
  );
};

const eliminarCliente = (req, res, next) => {
  const Id_cliente = req.params.Id_cliente;
  connection.query(
    "UPDATE clientes SET Estado = 0 WHERE Id_cliente= ?",
    [Id_cliente],
    (error, results) => {
      if (error) return next(error);
      res.json({
        message: "Cliente eliminado con éxito",
        results,
        status: 200,
      });
    }
  );
};

//PARA CREDITOS

const aumentarCredito = (req, res, next) => {
  console.log("Body recibido:", req.body);
  const Id_cliente = req.body.Id_cliente;
  const monto_credito = req.body.monto_credito;

  connection.query(
    "UPDATE clientes SET monto_credito = monto_credito + ? WHERE Id_cliente = ?",
    [monto_credito, Id_cliente],
    (error, results) => {
      if (error) return next(error);
      res.json({
        message: "Crédito aumentado con éxito",
        results,
        status: 200,
      });
    }
  );
};

const actualizarCredito = (req, res, next) => {
  const { id } = req.params;
  const { monto_credito } = req.body;

  connection.query(
    `UPDATE clientes SET monto_credito = ? WHERE Id_cliente = ?`,
    [monto_credito, id],
    (err, results) => {
      if (err) return next(err);
      res.json({
        message: "Crédito actualizado con éxito",
        results,
        status: 200,
      });
    }
  );
};

const registrarmovimiento = (req, res, next) => {
  connection.query(
    "INSERT INTO movimientosclientes SET ?",
    {
      Id_cliente: req.body.Id_cliente,
      montoCredito: req.body.montoCredito,
      montoDebito: req.body.montoDebito,
      Saldo: req.body.Saldo,
      Id_venta: req.body.Id_venta,
    },
    (error, results) => {
      if (error) return next(error);
      res.json({
        message: "Movimiento registrado con éxito",
        results,
        status: 201,
      });
    }
  );
};

const verMovimientosClientes = (req, res, next) => {
  const Id_cliente = req.params.Id_cliente;
  const fechaSeleccionada = req.params.fechaSeleccionada;

  const query = `
   SELECT
      mc.Id_movimientoCliente,
      mc.Id_cliente,
      mc.montoCredito AS Credito,
      mc.montoDebito AS Debito,
      mc.Saldo,
      mc.fechaRegistro,
      mc.Id_venta,
      p.nombre_producto,
      dv.cantidadVendida,
      dv.tipoVenta
    FROM movimientosclientes mc
    LEFT JOIN detalleventa dv ON dv.Id_venta = mc.Id_venta
    LEFT JOIN productos p ON p.Id_producto = dv.Id_producto
    WHERE mc.Id_cliente = ?
    AND DATE(mc.fechaRegistro) = ?
    ORDER BY mc.fechaRegistro ASC;
  `;

  connection.query(query, [Id_cliente, fechaSeleccionada], (error, results) => {
    if (error) return next(error);

    // Agrupar productos por movimiento
    const movimientosMap = {};
    results.forEach((row) => {
      if (!movimientosMap[row.Id_movimientoCliente]) {
        movimientosMap[row.Id_movimientoCliente] = {
          Id_movimientoCliente: row.Id_movimientoCliente,
          Id_cliente: row.Id_cliente,
          Credito: row.Credito,
          Debito: row.Debito,
          Saldo: row.Saldo,
          fechaRegistro: row.fechaRegistro,
          Id_venta: row.Id_venta,
          productos: [],
        };
      }
      if (row.nombre_producto) {
        movimientosMap[row.Id_movimientoCliente].productos.push({
          nombre_producto: row.nombre_producto,
          cantidadVendida: row.cantidadVendida,
          tipoVenta: row.tipoVenta,
        });
      }
    });

    // Convertir de objeto a array
    const movimientos = Object.values(movimientosMap);
    res.json({
      message: "Movimientos obtenidos con éxito",
      movimientos,
      status: 200,
    });
  });
};

module.exports = {
  verClientes,
  crearClientes,
  editarClientes,
  eliminarCliente,
  aumentarCredito,
  actualizarCredito,
  registrarmovimiento,
  verMovimientosClientes,
};
