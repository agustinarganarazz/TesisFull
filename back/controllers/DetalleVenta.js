const { connection } = require("../database/config");

const verDetalleVentaCompletoAgrupado = (req, res) => {
  connection.query(`
SELECT 
      v.Id_venta,
      v.fecha_registro,
      v.precioTotal_Venta,
      v.Id_cliente,
      v.Id_usuario,
      c.nombre_cliente AS nombre_cliente,
      u.nombre_usuario,
      dv.Id_detalleventa,
      dv.Id_producto,
      dv.cantidadVendida,
      dv.precioAplicado,
      dv.tipoVenta,
      p.nombre_producto AS nombre_producto,
      mp.nombre_metodopago AS metodo_pago
    FROM detalleventa dv
    INNER JOIN venta v ON v.Id_venta = dv.Id_venta
    INNER JOIN productos p ON p.Id_producto = dv.Id_producto
    INNER JOIN metodopago mp ON mp.Id_metodoPago = v.Id_metodoPago
    INNER JOIN usuarios u ON u.Id_usuario = v.Id_usuario
    INNER JOIN clientes c ON c.Id_cliente = v.Id_cliente
    ORDER BY v.Id_venta DESC, dv.Id_detalleventa
  `, (error, results) => {
    if (error) {
      console.error('Error al traer los detalles de venta:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    const ventasAgrupadas = results.reduce((acc, item) => {
      if (!acc[item.Id_venta]) {
        acc[item.Id_venta] = {
          Id_venta: item.Id_venta,
          fecha_registro: item.fecha_registro,
          precio_total: item.precioTotal_Venta,
          metodo_pago: item.metodo_pago,
          usuario: item.nombre_usuario,
          nombre_cliente: item.nombre_cliente,
          productos: []
        };
      }

      acc[item.Id_venta].productos.push({
        Id_detalleventa: item.Id_detalleventa,
        Id_producto: item.Id_producto,
        nombre_producto: item.nombre_producto,
        cantidadVendida: item.cantidadVendida,
        tipoVenta: item.tipoVenta,
        precioAplicado: item.precioAplicado
      });

      return acc;
    }, {});

    const ventas = Object.values(ventasAgrupadas);
    res.json(ventas);
  });
};


module.exports = {verDetalleVentaCompletoAgrupado}