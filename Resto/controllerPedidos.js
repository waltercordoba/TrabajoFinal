const middleware = require("./middleware");
const con = require("./dbConnection");
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const controllerUsuarios = require("./controllerUsuarios");
const queries = require("./queries");
var moment = require('moment');

// Funciones
async function deleteOrder(req, res){
    var idOrder = req.params.id;
    const token = req.headers.authorization.split(' ')[1];
    const rolLogueado = await verifyUserType(token);

    if (rolLogueado != 'ADMINISTRADOR')
    {
        res.status(401).send('Usuario no autorizado');
        return;
    }
   con.query(queries.getSqlDelDetOrder(idOrder), (errdet,rowsdet) => {
        if(errdet) 
            {
                throw errdet;
                return;
            }
            con.query(queries.getSqlDelOrder(idOrder), (err,rows) => {
                if(err) 
                {
                    throw err;
                    return;
                }
                if (rows['affectedRows'] > 0    )
                {
                    res.status(200).send("Pedido borrado exitosamente"); 
                } else
                {
                    res.status(404).send("Pedido no encontrado"); 
                }                        
            });
    });    
}
async function changeStatus(req, res){
    if(!req.body) {
        res.status(400).send("Informacion incorrecta");
        return;
    }    
    const idPedido = req.body.idPedido;
    const nuevo_estado = req.body.nuevo_estado;
    let idEstado;
    const token = req.headers.authorization.split(' ')[1];
    
    const rolLogueado = await verifyUserType(token);

    if (rolLogueado != 'ADMINISTRADOR')
    {
        res.status(401).send('Usuario no autorizado');
        return;
    }
    con.query(queries.getSqlIdStateByDesc(nuevo_estado), (errstate,rowsstate) => {

        if(errstate) 
            {
                throw errstate;
                return;
            } else
            {
                if (rowsstate.length > 0)
                {
                    idEstado = rowsstate[0].EST_ID;
                } else
                {
                    res.status(500).send("Se ha producido un error, contacte al administrador");
                    return;
                }
                con.query(queries.getSqlchangeState(idPedido, idEstado), (errupd,rowsupd) => {    
                    if(errupd) 
                    {
                        throw errupd;
                        return;
                    }
                    if (rowsupd['affectedRows'] > 0    )
                    {
                        res.status(200).send("Cambio de estado exitoso"); 
                    } else
                    {
                        res.status(404).send("Pedido no encontrado"); 
                    }
                });
            }
    }); 
}
async function getAllOrders(req, res){
    var ped_id;
    var todo;
    // Cabecera del pedido
    con.query(queries.getSqlAllOrders() , (errorders, rowsorders) => {
        if(errorders) 
        {
            throw errorders;
        }
        for (i=0; i<rowsorders.length; i++)
        {         
            ped_id = rowsorders[i].PED_ID;

            // Guardo cabecera del pedido (para obtener el id pedido)
            con.query(queries.getSqlDetailsOrder(ped_id), (errped,rowsped) => {
                if(errped) 
                {
                    throw errped;
                }
                todo = rowsorders.concat(rowsped);
                res.send(todo);    
            });   
        }          
    });     
}
async function getOrder(req, res){
    ped_id = req.params.id;
    //
    con.query(queries.getSqlOneOrder(ped_id) , (errorders, rowsorders) => {
        if(errorders) 
        {
            throw errorders;
        }    
        // Guardo cabecera del pedido (para obtener el id pedido)
        con.query(queries.getSqlDetailsOrder(ped_id), (errped,rowsped) => {
            if(errped) 
            {
                throw errped;
            }
            todo = rowsorders.concat(rowsped);
            res.send(todo);    
        });  
    });      
}

async function newOrder(req, res){
    if(!req.body) {
        res.status(400).send("Informacion incorrecta");
        return;
    }

    // Recupero el usuario conectado del payload
    const token = req.headers.authorization.split(' ')[1];
    usuarioLogueado =  controllerUsuarios.getUsrPayload(token);
    const idUsuario =  controllerUsuarios.getIdUsrPayload(token);

    // Recupero el producto
    const detalle = req.body.detalle;
    const direccion = req.body.direccion;
    var idProducto;
    var cantidad;
    var precio;
    var idPedido;
    var idDireccion;
    // Recupero forma de pago
    const idFormaPago = req.body.idFormaPago;
    
    // Obtengo la fecha y la hora
    var fechaPedido = moment().format('YYYY-MM-DD');
    var horaPedido  = moment().format('HH:mm:ss');

    // Guardo la direccion donde va el pedido - Obtengo el ID para relacionarlo al pedido
    con.query(queries.getSqlInsAddress(direccion[0].calle, direccion[0].numero, direccion[0].piso, direccion[0].departamento, direccion[0].sector) , (errdir, rowsdir) => {
        if(errdir) 
        {
            throw errdir;
        }
    }); 
    // Valido que los items existan en producto
    let product_list = '( '
    for (ind=0; ind<detalle.length; ind++)
    {   
        product_list += detalle[ind].idProducto;
        if (ind < detalle.length-1 )
        {
            product_list += ', ';
        }else
        {
            product_list += ' )';
        }
    }    
    con.query(queries.getSqlExistProduct(product_list), (errprod, rowsprod) => {
        if(errprod) 
        {
            res.status(404).send(errprod);
            throw errprod;
        }
        if (rowsprod[0].total_productos != detalle.length)
        {
            res.status(404).send('En el pedido hay productos que no existen');     
        }
    });     
    //
    // Recupero el id de la direccion agregada
    con.query(queries.getIdAddress(), (errlastid, rowslastid) => {
        if(errlastid) 
        {
            throw errlastid;
        }
        idDireccion = rowslastid[0].DIR_ID;
            // Guardo cabecera del pedido (para obtener el id pedido)
            con.query(queries.getSqlInsOneOrder(fechaPedido, horaPedido, idUsuario, idFormaPago, idDireccion), (errped,rowsped) => {
                if(errped) 
                {
                    throw errped;
                }
                idPedido = rowsped['insertId'];     

                // Guardo el detalle, los items del pedido
                for (ind=0; ind<detalle.length; ind++)
                {   // Recupero los items del body
                    idProducto = detalle[ind].idProducto;
                    cantidad = detalle[ind].cantidad;
                    precio = detalle[ind].precio;

                    con.query(queries.getSqlInsDetOrder(idPedido, idProducto, cantidad, precio), (errdet, rowsdet) => {
                        if(errdet) 
                        {
                            res.status(404).send(errdet);
                            throw errdet;
                        }
                    });   
                }    
                res.status(200).send('Se ha creado el pedido con exito');
            });         
    });     
   
}
async function verifyUserType(token)
{
	try {
        let usuarioLogueado = JSON.stringify(jwt.decode(token));
        // Obtiene el rol de usuario logueado del payload
        const inicio =  usuarioLogueado.indexOf("USU_ROL",0) + "USU_ROL".length + 3;
        const fin =  usuarioLogueado.indexOf(",",inicio) -2;
        rolLogueado = usuarioLogueado.substring(inicio, fin);
        //
        console.log(rolLogueado);
    } catch(err)
    {
        console.log("error");
    }
    return rolLogueado;
}
module.exports = {
    getAllOrders : getAllOrders,
    getOrder : getOrder,
    newOrder : newOrder,
    deleteOrder : deleteOrder,
    changeStatus : changeStatus
}