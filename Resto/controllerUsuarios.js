const con = require("./dbConnection");
const jwt = require("jsonwebtoken");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const queries = require("./queries");

async function getAllUsers(req, res){
    const token = req.headers.authorization.split(' ')[1];
    
    const rolLogueado = await verifyUserType(token);
    if (rolLogueado != 'ADMINISTRADOR')
    {
        res.status(401).send('Usuario no autorizado');
        return;
    }

   con.query(queries.getSqlAllUsr(), (err,rows) => {

        if(err) 
        {
            throw err;
        }

        res.status(200).send(rows);             

    });      
}

async function loginUsers(req, res)
{
    if(!req.body) {
        res.status(400).send("Informacion incorrecta");
        return;
    }    
    const {usuario, contrasena} = req.body;
    
    con.query(queries.getSqloneUsr(usuario), (err,rows) => {
        
        if(err) throw err;

        usuarioLogueado = rows[0];

        if (typeof usuarioLogueado == "undefined") 
        {
            res.status(404).send('No existe el usuario o la contraseña'); 
            return;
        }

        retorno = bcrypt.compare(contrasena, usuarioLogueado.USU_PASS);

        if(retorno)
        {
            const token = jwt.sign({usuarioLogueado}, 'claveseguranocompartida');
            var decoded = jwt.decode(token);
            res.send(token);               
        } else
        {
            es.status(404).send('No existe el usuario o la contraseña');         
        }
    });
}

async function addNewUser(req, res){
    if(!req.body) {
        res.status(400).send("Informacion incorrecta");
        return;
    }
    const usuario   = req.body.usuario;
    const password  = await bcrypt.hash(req.body.password,10);
    const nombre    = req.body.nombre;
    const apellido  = req.body.apellido;
    const mail      = req.body.mail;
    const telefono  = req.body.telefono;
    const rol       = req.body.rol;
    con.query(queries.getSqlInsOneUsr(usuario, password, nombre, apellido, mail, telefono, rol), (err,rows) => {

        if(err) 
        {
            throw err;
        }

        res.status(200).send("Usuario actualizado exitosamente");             

    });    
}

async function updateUser(req, res)
{  
    if(!req.body) 
    {
        res.status(400).send("Informacion incorrecta");
        return;
    }
    const token = req.headers.authorization.split(' ')[1];
    usrLogueado = getUsrPayload(token);
    const password  = await bcrypt.hash(req.body.password,10);
    const nombre    = req.body.nombre;
    const apellido  = req.body.apellido;
    const mail      = req.body.mail;
    const telefono  = req.body.telefono;

   con.query(queries.getSqlUpdUsr(usrLogueado, password, nombre, apellido, mail, telefono), (err,rows) => {

    if(err) 
        {
            throw err;
        }
        res.status(200).send("Usuario " + usrLogueado + " actualizado." );             
    });        
}
async function deleteUser(req, res){
    var idUsr = req.params.id;
    const {usuario} = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const rolLogueado = await verifyUserType(token);

    if (rolLogueado != 'ADMINISTRADOR')
    {
        res.status(401).send('Usuario no autorizado');
        return;
    }

   con.query(queries.getSqlDelUsr(idUsr), (err,rows) => {
        if(err) 
            {
                throw err;
            }
        res.status(200).send("Usuario borrado exitosamente");             
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
function getUsrPayload(token)
{
	try {
        let usuarioLogueado = JSON.stringify(jwt.decode(token));
        //
        const iniPos = usuarioLogueado.indexOf("USU_USUARIO") + 14;
        const finPos = usuarioLogueado.indexOf("USU_PASS") - 3;
        //
        const usu_usuario = usuarioLogueado.slice(iniPos, finPos);
        return usu_usuario;
    } catch(err)
    {
        console.log("Error:" + err);
    }
    return false;
}
function getIdUsrPayload(token)
{
	try {
        let usuarioLogueado = JSON.stringify(jwt.decode(token));
        //
        const iniPos = usuarioLogueado.indexOf("USU_ID") + 8;
        const finPos = usuarioLogueado.indexOf("USU_USUARIO") - 2;
        //
        const id_usuario = usuarioLogueado.slice(iniPos, finPos);
        return id_usuario;
    } catch(err)
    {
        console.log("Error:" + err);
    }
    return false;
}
module.exports = {
    loginUsers : loginUsers,
    getAllUsers : getAllUsers,
    addNewUser : addNewUser,
    updateUser : updateUser,
    deleteUser : deleteUser,
    getUsrPayload : getUsrPayload,
    getIdUsrPayload : getIdUsrPayload
}


