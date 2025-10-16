const {connection} = require('../database/config.js')

const verProductos = (req,res,next) => {
    connection.query('SELECT p.*, c.nombre_categoria FROM productos p JOIN categoria c ON p.Id_categoria = c.Id_categoria WHERE p.Estado = 1',
        (error,results) => {
        if(error) return next(error)
        res.json({messaje: 'Productos obtenidos con exito', results, status: 200})
    })
}

const crearProductos = (req,res,next) => {
    connection.query('INSERT INTO productos SET ?', {
        Id_producto: req.body.Id_producto,
        nombre_producto: req.body.nombre_producto,
        precio_costo: req.body.precio_costo,
        precio_unitario: req.body.precio_unitario,
        precio_tira: req.body.precio_tira,
        precio_caja: req.body.precio_caja,
        codigobarras_producto : req.body.codigobarras_producto,
        inventario_minimo: req.body.inventario_minimo,
        Id_categoria: req.body.Id_categoria,
        Estado : 1
    }, (error,results) => {
        if (error) return next(error)
        res.json({messaje: 'Producto creado con exito', results, status: 200} )
    })
}

const editarProducto = (req, res, next) => {
    const Id_producto = req.params.Id_producto
    const {nombre_producto,precio_unitario,precio_costo,precio_tira,precio_caja,codigobarras_producto,inventario_minimo, Id_categoria} = req.body;
    connection.query(
      `UPDATE productos SET
                          nombre_producto=?,
                          precio_unitario=?,
                          precio_costo=?,
                          precio_tira=?,
                          precio_caja=?,
                          codigobarras_producto=?,
                          inventario_minimo=?,
                          Id_categoria=?
                          WHERE Id_producto = ?`
                          ,[nombre_producto, precio_unitario, precio_costo, precio_tira, precio_caja, codigobarras_producto, inventario_minimo, Id_categoria, Id_producto]
                          ,(error, results)=>{
                                 if(error) return next(error)
                                  res.json({messaje: 'Producto editado con exito', results, status: 200} )
                              }
                          )
  };


const eliminarProductos = (req,res,next) => {
    const Id_producto = req.params.Id_producto
    connection.query('UPDATE productos SET Estado = 0 WHERE Id_producto= ?', [Id_producto],
        (error,results) => {
            if(error) return next(error)
            res.json({messaje: 'Producto eliminado con exito', results, status: 200})
        }
    )
}

const productosConStock = (req,res,next) => {
    connection.query(`SELECT
                        l.Id_lote,
                        l.Id_producto,
                        p.nombre_producto,
                        p.codigobarras_producto,
                        l.cantidad_disponible,
                        l.fecha_vencimiento,
                        l.nro_lote,
                        p.precio_unitario,
                        p.precio_tira,
                        p.precio_caja
                        FROM lotes l
                        JOIN productos p ON l.Id_producto = p.Id_producto
                        WHERE l.cantidad_disponible > 0
                        ORDER BY l.Id_producto, l.fecha_vencimiento ASC`,(error,results) => {
                            if (error) return next(error)
                            res.json({messaje: 'Productos con stock obtenidos con exito', results, status: 200})
                        })
}

//PRUEBA
const buscarProductos = (req, res, next) => {
    const { texto } = req.params;
    connection.query(`SELECT
                            l.Id_lote,
                            l.Id_producto,
                            p.nombre_producto,
                            p.codigobarras_producto,
                            l.cantidad_disponible,
                            l.fecha_vencimiento,
                            l.nro_lote,
                            p.precio_unitario,
                            p.precio_tira,
                            p.precio_caja
                        FROM lotes l
                        JOIN productos p ON l.Id_producto = p.Id_producto
                        WHERE p.Estado = 1
                        AND l.cantidad_disponible > 0
                        AND (p.nombre_producto LIKE ? OR p.codigobarras_producto LIKE ?)
                        ORDER BY l.Id_producto, l.fecha_vencimiento ASC`,[`%${texto}%`, `%${texto}%`],
                        (error, results) => {
                            if (error) return next(error);
                            res.json({messaje: 'Productos encontrados con exito', results, status: 200});
                        }
    );
};


module.exports={verProductos,crearProductos,editarProducto,eliminarProductos,productosConStock,buscarProductos}
