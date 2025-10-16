const { connection } = require("../database/config");

const verStock = (req, res, next) => {
  connection.query(
    `SELECT
        p.Id_producto,
        p.nombre_producto,
        l.nro_lote,
        l.fecha_vencimiento,
        l.cantidad_disponible,
        total_por_producto.total_disponible
      FROM lotes l
      JOIN productos p ON p.Id_producto = l.Id_producto
      JOIN (
        SELECT Id_producto, SUM(cantidad_disponible) AS total_disponible
        FROM lotes
        WHERE fecha_vencimiento >= CURDATE()
        GROUP BY Id_producto
      ) total_por_producto ON total_por_producto.Id_producto = p.Id_producto
      WHERE l.cantidad_disponible > 0
      ORDER BY total_por_producto.total_disponible DESC, p.nombre_producto ASC, l.fecha_vencimiento ASC`,
    (error, results) => {
      if (error) return next(error);

      //creo un objeto vacio donde agrupar los productos por nombre
      const agrupado = {};

      //es el resultado de la consulta por cada fila traigo:
      results.forEach(row => {
        const { Id_producto, nombre_producto, fecha_vencimiento, cantidad_disponible, nro_lote } = row;

        //valido si el producto ya existe en agrupado
        if (!agrupado[nombre_producto]) {
          agrupado[nombre_producto] = {
            Id_producto,
            total: 0,
            detalle_fechas: []
          };
        }

        // Sumamos solo si no está vencido
        if (new Date(fecha_vencimiento) >= new Date()) {
          agrupado[nombre_producto].total += cantidad_disponible;
        }

        // Agregamos todos los lotes (válidos y vencidos) para control
        agrupado[nombre_producto].detalle_fechas.push({
          nro_lote,
          fecha_vencimiento,
          cantidad: cantidad_disponible
        });
      });

      res.json({ messaje: 'Stock obtenido con exito', results: Object.values(agrupado), status: 200 } );
    }
  );
};

const verTotalProductoCategorias = (req,res,next) => {
  connection.query(`SELECT
                          c.nombre_categoria,
                          SUM(l.cantidad_disponible) AS total_disponible
                      FROM lotes l
                      JOIN productos p ON p.Id_producto = l.Id_producto
                      JOIN categoria c ON c.Id_categoria = p.Id_categoria
                      WHERE l.fecha_vencimiento >= CURDATE()
                        AND l.cantidad_disponible > 0
                      GROUP BY c.nombre_categoria
                      ORDER BY total_disponible DESC, c.nombre_categoria ASC`, (error,results) => {
                      if (error) return next(error);
                      res.json({ messaje: 'Total por categoría obtenido con éxito', results, status: 200 });
                    })
}

const verProductosVencidos = (req,res,next) => {
  connection.query(`SELECT
                        p.Id_producto,
                        p.nombre_producto,
                        SUM(l.cantidad_disponible) AS total_vencido
                    FROM lotes l
                    JOIN productos p ON p.Id_producto = l.Id_producto
                    WHERE l.fecha_vencimiento < CURDATE()  -- solo vencidos
                      AND l.cantidad_disponible > 0
                    GROUP BY p.Id_producto, p.nombre_producto
                    ORDER BY total_vencido DESC, p.nombre_producto ASC`,(error,results) => {
                      if (error) return next(error);
                      res.json({ messaje: 'Productos vencidos obtenidos con éxito', results, status: 200 });
                    })
}

// Ejemplo de uso de parámetros preparados para una consulta de actualización
const actualizarMetodoPago = (req, res, next) => {
  const { nombre_metodopago, Id_metodoPago } = req.body;

  connection.query(
    'UPDATE metodopago SET nombre_metodopago = ? WHERE Id_metodoPago = ?',
    [nombre_metodopago, Id_metodoPago],
    (error, results) => {
      if (error) return next(error);
      res.json({ message: 'Método de pago actualizado correctamente', status: 200 });
    }
  );
}

module.exports = {verStock, verTotalProductoCategorias, verProductosVencidos, actualizarMetodoPago}
