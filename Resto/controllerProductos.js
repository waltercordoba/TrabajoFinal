const con = require("./dbConnection");
const jwt = require("jsonwebtoken");
const bodyParser = require('body-parser');
const queries = require("./queries");
const fs = require("fs");
const config = require("./config");

// Funciones
async function addProducts(req, res){
    if(!req.body) {
        res.status(400).send("Informacion incorrecta");
        return;
    }

    // Controlo si el usuario del Paylod tiene rol administrador
    const token = req.headers.authorization.split(' ')[1];
    const rolLogueado = await verifyUserType(token);
    if (rolLogueado != 'ADMINISTRADOR')
    {
        res.status(401).send('Usuario no autorizado');
        return;
    }     

    var descripcion   = req.body.descripcion;
    var precio        = req.body.precio;
    var imagen        = req.body.imagen; // La imagen en base 64
    //
    var extension = imagen.substring('data:image/'.length, imagen.indexOf(";base64",0) );
    var substringToReplace =           imagen.substring(0, imagen.indexOf(";base64,0") + 24);
    var imagen = imagen.replace(substringToReplace, '');
    
    // Generamos el nombre de la imagen para guardar en disco
    var nombreImagen = new Date().getTime().toString();
    nombreImagen +=('.') + extension;

    // Guarda la imagen.
    fs.writeFile(`${config.imageFolder}/${nombreImagen}`, imagen, {encoding: 'base64'},
        async function(erro) { 

            if(erro) {
                console.log(erro);
                res.status(500).send("Se ha producido un error, contacte al administrador" );
                return;
            };        

           con.query(queries.getSqlInsProduct(descripcion, precio, nombreImagen), (err,rows) => {

            if(err) 
            {
                throw err;
            }
            res.status(200).send('Producto agregado con éxito');
    
        });           
    });

 }

async function getAllProducts(req, res){
   con.query(queries.getSqlAllProducts(), (err,rows) => {

    if(err) 
    {
        throw err;
    }

    res.status(200).send(rows);             

});     
}
async function updateProducts(req, res)
{  
    // Controlo si la body esta completo
    if(!req.body) {
        res.status(400).send("informacion incorrecta");
        return;
    }   

    // Controlo si el usuario del Paylod tiene rol administrador
    const token = req.headers.authorization.split(' ')[1];
    const rolLogueado = await verifyUserType(token);
    if (rolLogueado != 'ADMINISTRADOR')
    {
        res.status(401).send('Usuario no autorizado');
        return;
    }    

    var id            = req.body.id;    
    var descripcion   = req.body.descripcion;
    var precio        = req.body.precio;
    var imagen        = req.body.imagen; // La imagen en base 64
    //
    var extension = imagen.substring('data:image/'.length, imagen.indexOf(";base64",0) );
    var substringToReplace =           imagen.substring(0, imagen.indexOf(";base64,0") + 24);
    var imagen = imagen.replace(substringToReplace, '');
    
    // Generamos el nombre de la imagen para guardar en disco
    var nombreImagen = new Date().getTime().toString();
    nombreImagen +=('.') + extension;

    // Guarda la imagen.
    fs.writeFile(`${config.imageFolder}/${nombreImagen}`, imagen, {encoding: 'base64'},
        async function(erro) { 

            if(erro) {
                console.log(erro);
                res.status(500).send("Se ha producido un error, contacte al administrador" );
                return;
            };        

           con.query(queries.getSqlUpdProd(id, descripcion, precio, nombreImagen), (err,rows) => {

            if(err) 
            {
                throw err;
            }
            if (rows['affectedRows'] > 0)
            {
                res.status(200).send("Producto actualizado con éxito"); 
            }
            else
            {
                res.status(200).send("No existe el producto");
            }
    
        });              
    });    
    //
}
async function getFavorites(req, res){
    // Busco el usuario en el payload
    const token = req.headers.authorization.split(' ')[1];
    const usuarioLogueado = verifyUser(token);    

    con.query(queries.getSqlFavorites(usuarioLogueado), (err,rows) => {

        if(err) 
        {
            throw err;
        }

        res.status(200).send(rows);             

    });       
}
function verifyUser(token)
{
    let usrLog;
	try {
        let usuarioLogueado =JSON.stringify(jwt.decode(token));
        const inicio =  usuarioLogueado.indexOf("USU_USUARIO",0) + "USU_USUARIO".length + 3;
        const fin =  usuarioLogueado.indexOf(",",inicio) -1;
        usrLog = usuarioLogueado.substring(inicio, fin);
    } catch(err)
    {
        console.log("error");
    }
    return usrLog;
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
async function deleteProduct(req, res){
    var idProduct = req.params.id;
    const token = req.headers.authorization.split(' ')[1];
    const rolLogueado = await verifyUserType(token);

    if (rolLogueado != 'ADMINISTRADOR')
    {
        res.status(401).send('Usuario no autorizado');
        return;
    }

   con.query(queries.getSqlDelProduct(idProduct), (err,rows) => {
        if(err) 
            {
                throw err;
            }
        res.status(200).send("Producto borrado exitosamente");             
    });    
}
module.exports = {
    addProducts : addProducts,
    getAllProducts : getAllProducts,
    updateProducts : updateProducts,
    getFavorites : getFavorites,
    deleteProduct : deleteProduct
}