# TrabajoFinal
********************************************
	Herramientas necesarias
********************************************
-Visual Studio
-Postman
-Node js
-MySQL
********************************************
1- Crear la base de datos en MySql e importar datos de prueba: 
	BaseDeDatos.sql
	
2- En Visual Studio instalar las dependencias del proyecto: 
	npm install
	
3- Descargar el proyecto desde el repositorio Github: 
	https://github.com/waltercordoba/TrabajoFinal.git
	
4- Abrir Postman e importar el archivo: 
	TrabajoFinal.postman_collection.json

5- En la carpeta TrabajoFinal\Resto ejecutar el comando: 
	node index.js 

Informacion complementaria:
********************************************
*    Usuarios/Passwords precargados
********************************************
cliente/cliente
administrador/administrador
otrocliente/otrocliente
********************************************
*	Listado de endpoints (Postman)
********************************************
TrabajoFinal.postman_collection.json
********************************************
*	Listado de endpoints (Postman)
********************************************
Key: Authorization ✓
Bearer: Precargados en el archivo postman. 
********************************************
		Parametros de conexion
********************************************
Ubicacion: dbConnection.json

    user: "root",
    password: "123",
    database: "resto",
    host: "localhost",
    connectionLimit: 10
