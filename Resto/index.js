const express = require('express');
const app = express();
app.use('/images', express.static(__dirname + '/images'));

const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));

const cors = require('cors');
app.use(cors());
app.options('*', cors());

const controllerUsuarios = require("./controllerUsuarios");
const controllerPedidos = require("./controllerPedidos");
const controllerProductos = require("./controllerProductos");
const middleware = require("./middleware");
const connections = require("./dbConnection.js");


app.post("/usuarios/agregar", controllerUsuarios.addNewUser);// Agrega un Usuario 
app.post('/login' , controllerUsuarios.loginUsers);// Login de usuarios
app.get("/usuarios", middleware.autenthicUser, controllerUsuarios.getAllUsers);// Trae los Usuarios
app.put("/usuario/actualizar", middleware.autenthicUser, controllerUsuarios.updateUser);// Update del Usuario 
app.delete("/usuarios/borrar/:id", middleware.autenthicUser, controllerUsuarios.deleteUser);// Borra un Usuario 


app.get("/pedidos", middleware.autenthicUser, controllerPedidos.getAllOrders);// Listado de Pedidos
app.get("/pedidos/:id", middleware.autenthicUser, controllerPedidos.getOrder);// Trae un Pedido particular 
app.post("/pedido/agregar", middleware.autenthicUser, controllerPedidos.newOrder);// Agrega un Pedido 
app.put("/pedido/cambiarestado", middleware.autenthicUser, controllerPedidos.changeStatus);// Cambia el estado de un Pedido (OK)
app.delete("/pedidos/borrar/:id", middleware.autenthicUser, controllerPedidos.deleteOrder);// Borra un Pedido 


app.get("/productos", middleware.autenthicUser, controllerProductos.getAllProducts);// Listado de Productos 
app.put("/producto/actualizar", middleware.autenthicUser, controllerProductos.updateProducts);// Update de Productos 
app.post("/productos/agregar", middleware.autenthicUser, controllerProductos.addProducts);// Agrega un Producto 
app.delete("/productos/borrar/:id", middleware.autenthicUser, controllerProductos.deleteProduct);// Borra un Producto 
app.get("/favoritos", middleware.autenthicUser, controllerProductos.getFavorites);// Listado de Preferencias 



// Puerto de escucha
app.listen(8181, () => {
    console.log("app iniciada...");

    // Conectar con base de datos
    connections.connect();
})
