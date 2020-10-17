    function getSqlAllUsr()
    {
        let my_sql= "SELECT USU_USUARIO, CONCAT(USU_NOM,' ',USU_APE ) NOM_Y_APE, USU_PASS from usuarios order by USU_APE DESC";
        return my_sql;
    }
    function getSqlOneUsr(usuario)
    {
        let my_sql= "SELECT USU_ID, USU_USUARIO, USU_PASS, CONCAT(USU_NOM,' ',USU_APE ) NOM_Y_APE, USU_MAIL, USU_TELEFONO, upper(roles.ROL_DESCRIPCION) USU_ROL"
        + " from usuarios, roles where USU_USUARIO = '" + usuario + "' AND usuarios.USU_ROL_ID = roles.ROL_ID";
        return my_sql;
    } 
    function getSqlDelUsr(idUsr)
    {
        let my_sql= "DELETE FROM usuarios where USU_ID = " + idUsr ;
        return my_sql;
    }     
    function getSqlAllOrders()
    {
        let my_sql = "SELECT ped.PED_HORA, est.EST_DESCRIPCION, ped.PED_ID, fp.FOR_DESCRIPCION,"
        + " CONCAT(usu.USU_NOM,' ',usu.USU_APE ) NOM_Y_APE, dir.DIR_CALLE, dir.DIR_SECTOR, dir.DIR_NRO, dir.DIR_PISO, dir.DIR_DPTO"
        + " FROM pedidos ped, estados est, forma_pago fp, usuarios usu, direcciones dir"
        + " WHERE ped.PED_EST_ID = est.EST_ID"
        + " AND ped.PED_FOR_ID = fp.FOR_ID"
        + " AND ped.PED_USU_ID = usu.USU_ID"
        + " AND ped.PED_DIR_ID = dir.DIR_ID"
        + " ORDER BY ped.PED_ID";
        return my_sql;
    }     
    function getSqlDetailsOrder(ped_id){
        let my_sql = "SELECT pro.PRO_DESCRIPCION, det.DET_CAN, det.DET_PRECIO"
        + " FROM detalle_pedido det LEFT OUTER JOIN productos pro "
        + " ON pro.PRO_ID = det.DET_PRO_ID "
        + " AND det.DET_PED_ID = " + ped_id;
        return my_sql;
    }    
    function getSqlOneOrder(ped_id)
    {
        let my_sql = "SELECT usu.USU_USUARIO, usu.USU_MAIL, CONCAT(usu.USU_NOM,' ',usu.USU_APE ) NOM_Y_APE,"
        + " dir.DIR_CALLE, dir.DIR_SECTOR, dir.DIR_NRO, dir.DIR_PISO, dir.DIR_DPTO, usu.USU_TELEFONO, ped.PED_ID, est.EST_DESCRIPCION, fp.FOR_DESCRIPCION"
        + " FROM pedidos ped, estados est, forma_pago fp, usuarios usu, direcciones dir "
        + " WHERE ped.PED_EST_ID = est.EST_ID"
        + " AND ped.PED_FOR_ID = fp.FOR_ID"
        + " AND ped.PED_USU_ID = usu.USU_ID"
        + " AND ped.PED_DIR_ID = dir.DIR_ID"
        + " AND ped.PED_ID = " + ped_id ;
        return my_sql;
    }       
    function getSqlInsOneUsr(usuario, password, nombre, apellido, mail, telefono, rol) 
    {
        let my_sql = "INSERT INTO USUARIOS (USU_USUARIO, USU_PASS, USU_NOM, USU_APE, USU_MAIL, USU_TELEFONO, USU_ROL_ID)"
        + " VALUES (" 
        + "'" + usuario + "', "
        + "'" + password + "', "
        + "'" + nombre + "', "
        + "'" + apellido + "', "
        + "'" + mail + "', "  
        + "'" + telefono + "', "
        + rol + ") ";     
        return my_sql;
    }         
    function getSqlUpdUsr(usuario, password, nombre, apellido, mail, telefono) 
    {
        let my_sql = "UPDATE USUARIOS"
        + " set USU_PASS ='" + password 
        + "' ,USU_NOM ='" + nombre 
        + "' ,USU_APE ='" + apellido 
        + "' ,USU_MAIL ='" + mail 
        + "' ,USU_TELEFONO ='" + telefono
        + "' where USU_USUARIO ='" + usuario + "'";
        return my_sql;
    }    
    function getSqlInsProduct(descripcion, precio, img) 
    {
        let my_sql = "INSERT INTO PRODUCTOS (PRO_DESCRIPCION, PRO_PRECIO, PRO_IMG)"
        + " VALUES (" 
        + "'" + descripcion + "', "
        + "'" + precio + "', "
        + "'" + img + "') "
        return my_sql;
    }
    function getSqlAllProducts()
    {
        let my_sql= 'SELECT PRO_ID, PRO_DESCRIPCION, PRO_PRECIO, PRO_IMG from productos';
        return my_sql;
    }     
    function getSqlUpdProd(id, descripcion, precio, nombreImagen) 
    {
        let my_sql = "UPDATE PRODUCTOS"
        + " set PRO_DESCRIPCION ='" + descripcion 
        + "' ,PRO_PRECIO ='" + precio 
        + "' ,PRO_IMG ='" + nombreImagen 
        + "' where PRO_ID ='" + id + "'";
        return my_sql;
    }   
    function getSqlFavorites(usuarioLogueado)
    {
        let my_sql= 'SELECT productos.PRO_DESCRIPCION, productos.PRO_PRECIO, productos.PRO_IMG'
        + " FROM favoritos LEFT OUTER JOIN productos" 
        + " ON favoritos.FAV_PRO_ID = productos.PRO_ID"  
        + " INNER JOIN usuarios"
        + " ON favoritos.FAV_USU_ID = usuarios.USU_ID"        
        + " WHERE usuarios.USU_USUARIO = '" + usuarioLogueado + "'";
        return my_sql;
    }   
    function getSqlInsAddress(calle, numero, piso, departamento, sector) 
    {
        let my_sql = "INSERT INTO DIRECCIONES (DIR_CALLE, DIR_NRO, DIR_PISO, DIR_DPTO, DIR_SECTOR)"
        + " VALUES (" 
        + "'" + calle + "', "
        + "'" + numero + "', "
        + "'" + piso + "', "
        + "'" + departamento + "', "
        + "'" + sector + "') ";        
        return my_sql;
    }       
    function getSqlInsOneOrder(fechaPedido, horaPedido, idUsuario, idFormaPago, idDireccion) 
    {
        let my_sql = "INSERT INTO PEDIDOS (PED_FECHA, PED_HORA, PED_USU_ID, PED_FOR_ID, PED_DIR_ID)"
        + " VALUES (" 
        + "'" + fechaPedido + "', "
        + "'" + horaPedido + "', "
        + "'" + idUsuario + "', "
        + "'" + idFormaPago + "', "
        + "'" + idDireccion + "') ";        
        return my_sql;
    }  
    function getSqlInsDetOrder(idPedido, idProducto, cantidad, precio) 
    {
        let my_sql = "INSERT INTO DETALLE_PEDIDO (DET_PED_ID, DET_PRO_ID, DET_CAN, DET_PRECIO)"
        + " VALUES (" 
        + "'" + idPedido + "', "
        + "'" + idProducto + "', "
        + "'" + cantidad + "', "
        + "'" + precio + "') ";        
        return my_sql;
    }  
    function getIdAddress() 
    {
        let my_sql = "SELECT MAX(DIR_ID) DIR_ID FROM DIRECCIONES";
        return my_sql;
    }  
    function getSqlIdStateByDesc(nuevo_estado)   
    {  
        let my_sql = "SELECT EST_ID FROM estados " 
        +             "WHERE EST_DESCRIPCION = '" + nuevo_estado + "'";
        return my_sql;    
    }      
    function getSqlchangeState(idPedido, idEstado)   
    {  
        let my_sql = "UPDATE pedidos ped " 
        +            "SET ped.PED_EST_ID = " + idEstado
        +            " WHERE ped.PED_ID =" + idPedido ;     
        return my_sql;    
    } 
    function getSqlDelDetOrder(idOrder)
    {
        let my_sql= "DELETE FROM detalle_pedido where DET_PED_ID = " + idOrder ;
        return my_sql;
    }       
    function getSqlDelOrder(idOrder)
    {
        let my_sql= "DELETE FROM pedidos where PED_ID = " + idOrder ;
        return my_sql;
    }    
    function getSqlExistProduct(product_list)
    {
        let my_sql= "SELECT COUNT(*) total_productos FROM productos where PRO_ID IN " + product_list ;
        return my_sql;
    }     
    function getSqlDelProduct(idProduct)
    {
        let my_sql= "DELETE FROM productos where PRO_ID = " + idProduct ;
        return my_sql;
    }                        
  module.exports = {
    getSqloneUsr : getSqlOneUsr,
    getSqlAllUsr : getSqlAllUsr,
    getSqlUpdUsr : getSqlUpdUsr,
    getSqlDelUsr : getSqlDelUsr,
    getSqlInsOneUsr : getSqlInsOneUsr,   
    getSqlInsAddress : getSqlInsAddress,
    getIdAddress : getIdAddress,
    //
    getSqlOneOrder : getSqlOneOrder,
    getSqlAllOrders: getSqlAllOrders,
    getSqlDetailsOrder : getSqlDetailsOrder,
    getSqlchangeState : getSqlchangeState,
    getSqlIdStateByDesc : getSqlIdStateByDesc, 
    getSqlDelOrder : getSqlDelOrder,
    getSqlDelDetOrder : getSqlDelDetOrder,   
    //
    getSqlInsProduct : getSqlInsProduct,
    getSqlAllProducts : getSqlAllProducts,
    getSqlUpdProd : getSqlUpdProd,
    getSqlFavorites : getSqlFavorites,
    getSqlIdStateByDesc : getSqlIdStateByDesc,
    getSqlExistProduct : getSqlExistProduct,
    getSqlDelProduct : getSqlDelProduct,
    //
    getSqlInsOneOrder: getSqlInsOneOrder,
    getSqlInsDetOrder : getSqlInsDetOrder
  }

  