const mysql = require('promise-mysql');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const autenthicUser = (req, res, next) => {
	try {
            const token = req.headers.authorization.split(' ')[1];
            const verificarToken = jwt.verify(token, 'claveseguranocompartida');
            if (verificarToken) 
            {
                req.usuario = verificarToken;
                usuarioConectado=verificarToken;
                return next();
            }
        } catch(err)
        {
		    res.json({error:'Error al validar el usuario:' + err});
	    }
}
module.exports = {
    autenthicUser : autenthicUser
}