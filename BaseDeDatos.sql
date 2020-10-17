-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         10.4.12-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             11.0.0.5919
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Volcando estructura de base de datos para resto
DROP DATABASE IF EXISTS `resto`;
CREATE DATABASE IF NOT EXISTS `resto` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `resto`;

-- Volcando estructura para tabla resto.detalle_pedido
DROP TABLE IF EXISTS `detalle_pedido`;
CREATE TABLE IF NOT EXISTS `detalle_pedido` (
  `DET_ID` int(11) NOT NULL AUTO_INCREMENT,
  `DET_PED_ID` int(11) NOT NULL,
  `DET_PRO_ID` int(11) NOT NULL,
  `DET_CAN` float NOT NULL,
  `DET_PRECIO` float NOT NULL,
  PRIMARY KEY (`DET_ID`),
  KEY `FK_detalle_pedido_pedidos` (`DET_PED_ID`),
  CONSTRAINT `FK_detalle_pedido_pedidos` FOREIGN KEY (`DET_PED_ID`) REFERENCES `pedidos` (`PED_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;

-- Volcando datos para la tabla resto.detalle_pedido: ~2 rows (aproximadamente)
/*!40000 ALTER TABLE `detalle_pedido` DISABLE KEYS */;
REPLACE INTO `detalle_pedido` (`DET_ID`, `DET_PED_ID`, `DET_PRO_ID`, `DET_CAN`, `DET_PRECIO`) VALUES
	(16, 63, 26, 2, 600),
	(17, 63, 31, 1, 100.5);
/*!40000 ALTER TABLE `detalle_pedido` ENABLE KEYS */;

-- Volcando estructura para tabla resto.direcciones
DROP TABLE IF EXISTS `direcciones`;
CREATE TABLE IF NOT EXISTS `direcciones` (
  `DIR_ID` int(11) NOT NULL AUTO_INCREMENT,
  `DIR_CALLE` varchar(30) NOT NULL,
  `DIR_NRO` varchar(20) NOT NULL,
  `DIR_PISO` varchar(2) NOT NULL,
  `DIR_DPTO` varchar(4) NOT NULL,
  `DIR_SECTOR` varchar(20) NOT NULL,
  PRIMARY KEY (`DIR_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=latin1 COMMENT='Estructura de domicilios';

-- Volcando datos para la tabla resto.direcciones: ~1 rows (aproximadamente)
/*!40000 ALTER TABLE `direcciones` DISABLE KEYS */;
REPLACE INTO `direcciones` (`DIR_ID`, `DIR_CALLE`, `DIR_NRO`, `DIR_PISO`, `DIR_DPTO`, `DIR_SECTOR`) VALUES
	(70, 'Rosario de Santa Fe', '43', '1', 'A', '');
/*!40000 ALTER TABLE `direcciones` ENABLE KEYS */;

-- Volcando estructura para tabla resto.estados
DROP TABLE IF EXISTS `estados`;
CREATE TABLE IF NOT EXISTS `estados` (
  `EST_ID` int(11) NOT NULL AUTO_INCREMENT,
  `EST_DESCRIPCION` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`EST_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1 COMMENT='Estados de los pedidos';

-- Volcando datos para la tabla resto.estados: ~6 rows (aproximadamente)
/*!40000 ALTER TABLE `estados` DISABLE KEYS */;
REPLACE INTO `estados` (`EST_ID`, `EST_DESCRIPCION`) VALUES
	(1, 'Nuevo'),
	(2, 'Confirmado'),
	(3, 'En Preparacion'),
	(4, 'En Camino'),
	(5, 'Entregado'),
	(6, 'Cancelado');
/*!40000 ALTER TABLE `estados` ENABLE KEYS */;

-- Volcando estructura para tabla resto.favoritos
DROP TABLE IF EXISTS `favoritos`;
CREATE TABLE IF NOT EXISTS `favoritos` (
  `FAV_ID` int(11) NOT NULL AUTO_INCREMENT,
  `FAV_USU_ID` int(11) NOT NULL,
  `FAV_PRO_ID` int(11) NOT NULL,
  PRIMARY KEY (`FAV_ID`),
  KEY `FK_favoritos_usuarios` (`FAV_USU_ID`),
  KEY `FK_favoritos_productos` (`FAV_PRO_ID`),
  CONSTRAINT `FK_favoritos_usuarios` FOREIGN KEY (`FAV_USU_ID`) REFERENCES `usuarios` (`USU_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1 COMMENT='Productos favoritos del usuario';

-- Volcando datos para la tabla resto.favoritos: ~2 rows (aproximadamente)
/*!40000 ALTER TABLE `favoritos` DISABLE KEYS */;
REPLACE INTO `favoritos` (`FAV_ID`, `FAV_USU_ID`, `FAV_PRO_ID`) VALUES
	(3, 67, 26),
	(4, 67, 31);
/*!40000 ALTER TABLE `favoritos` ENABLE KEYS */;

-- Volcando estructura para tabla resto.forma_pago
DROP TABLE IF EXISTS `forma_pago`;
CREATE TABLE IF NOT EXISTS `forma_pago` (
  `FOR_ID` int(11) NOT NULL AUTO_INCREMENT,
  `FOR_DESCRIPCION` varchar(30) NOT NULL,
  PRIMARY KEY (`FOR_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- Volcando datos para la tabla resto.forma_pago: ~2 rows (aproximadamente)
/*!40000 ALTER TABLE `forma_pago` DISABLE KEYS */;
REPLACE INTO `forma_pago` (`FOR_ID`, `FOR_DESCRIPCION`) VALUES
	(1, 'Efectivo'),
	(2, 'Tarjeta de Credito'),
	(3, 'Tarjeta de Debito');
/*!40000 ALTER TABLE `forma_pago` ENABLE KEYS */;

-- Volcando estructura para tabla resto.pedidos
DROP TABLE IF EXISTS `pedidos`;
CREATE TABLE IF NOT EXISTS `pedidos` (
  `PED_ID` int(11) NOT NULL AUTO_INCREMENT,
  `PED_FECHA` date DEFAULT current_timestamp(),
  `PED_HORA` time DEFAULT current_timestamp(),
  `PED_EST_ID` int(11) NOT NULL DEFAULT 1,
  `PED_USU_ID` int(11) NOT NULL,
  `PED_FOR_ID` int(11) NOT NULL,
  `PED_DIR_ID` int(11) NOT NULL,
  PRIMARY KEY (`PED_ID`),
  KEY `FK_pedidos_estados` (`PED_EST_ID`),
  KEY `FK_pedidos_usuarios` (`PED_USU_ID`),
  KEY `FK_pedidos_forma_pago` (`PED_FOR_ID`),
  KEY `FK_pedidos_direccion` (`PED_DIR_ID`),
  CONSTRAINT `FK_pedidos_direccion` FOREIGN KEY (`PED_DIR_ID`) REFERENCES `direcciones` (`DIR_ID`),
  CONSTRAINT `FK_pedidos_estados` FOREIGN KEY (`PED_EST_ID`) REFERENCES `estados` (`EST_ID`),
  CONSTRAINT `FK_pedidos_forma_pago` FOREIGN KEY (`PED_FOR_ID`) REFERENCES `forma_pago` (`FOR_ID`),
  CONSTRAINT `FK_pedidos_usuarios` FOREIGN KEY (`PED_USU_ID`) REFERENCES `usuarios` (`USU_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=latin1;

-- Volcando datos para la tabla resto.pedidos: ~1 rows (aproximadamente)
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
REPLACE INTO `pedidos` (`PED_ID`, `PED_FECHA`, `PED_HORA`, `PED_EST_ID`, `PED_USU_ID`, `PED_FOR_ID`, `PED_DIR_ID`) VALUES
	(63, '2020-10-13', '22:15:32', 1, 67, 1, 70);
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;

-- Volcando estructura para tabla resto.productos
DROP TABLE IF EXISTS `productos`;
CREATE TABLE IF NOT EXISTS `productos` (
  `PRO_ID` int(11) NOT NULL AUTO_INCREMENT,
  `PRO_DESCRIPCION` varchar(30) NOT NULL,
  `PRO_PRECIO` float NOT NULL,
  `PRO_IMG` varchar(30) NOT NULL,
  PRIMARY KEY (`PRO_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=latin1 COMMENT='Productos a la venta';

-- Volcando datos para la tabla resto.productos: ~1 rows (aproximadamente)
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
REPLACE INTO `productos` (`PRO_ID`, `PRO_DESCRIPCION`, `PRO_PRECIO`, `PRO_IMG`) VALUES
	(26, 'Sandwich Veggie', 600, '1600522596820.jpeg'),
	(31, 'Ensalada griega', 100.5, '1600523812816.jpeg');
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;

-- Volcando estructura para tabla resto.roles
DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `ROL_ID` int(11) NOT NULL AUTO_INCREMENT,
  `ROL_DESCRIPCION` varchar(30) NOT NULL,
  PRIMARY KEY (`ROL_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COMMENT='Roles de usuarios';

-- Volcando datos para la tabla resto.roles: ~1 rows (aproximadamente)
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
REPLACE INTO `roles` (`ROL_ID`, `ROL_DESCRIPCION`) VALUES
	(1, 'ADMINISTRADOR'),
	(2, 'CLIENTE');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;

-- Volcando estructura para tabla resto.usuarios
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `USU_ID` int(11) NOT NULL AUTO_INCREMENT,
  `USU_USUARIO` varchar(30) NOT NULL,
  `USU_PASS` varchar(200) NOT NULL,
  `USU_NOM` varchar(30) NOT NULL,
  `USU_APE` varchar(30) NOT NULL,
  `USU_MAIL` varchar(30) NOT NULL,
  `USU_TELEFONO` varchar(30) NOT NULL,
  `USU_ROL_ID` int(11) NOT NULL,
  PRIMARY KEY (`USU_ID`),
  UNIQUE KEY `USU_USUARIO` (`USU_USUARIO`),
  KEY `FK_usuarios_roles` (`USU_ROL_ID`),
  CONSTRAINT `FK_usuarios_roles` FOREIGN KEY (`USU_ROL_ID`) REFERENCES `roles` (`ROL_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=latin1 COMMENT='Usuarios del sistema';

-- Volcando datos para la tabla resto.usuarios: ~4 rows (aproximadamente)
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
REPLACE INTO `usuarios` (`USU_ID`, `USU_USUARIO`, `USU_PASS`, `USU_NOM`, `USU_APE`, `USU_MAIL`, `USU_TELEFONO`, `USU_ROL_ID`) VALUES
	(64, 'administrador', '$2b$10$3wGkcjTxgsRvQU/TEoM3ZuHoNHoPI8oaKVVOyQ8YqzJ3xkXBvfriu', 'UN', 'Administrador', '8asf@gmail.com', '549351221234', 1),
	(67, 'cliente', '$2b$10$XirNlHHTAv1CLk5zE/.4R.4OEHjwUcvkrulusRBiFmfy4s5orGziO', 'primer', 'Cliente', 'otro_mail_cliente@gmail.com', '43210', 2),
	(76, 'otrocliente', '$2b$10$BAZJB7jaPPnxrX91kfWsI.wQYOCw8uC4zLBwZbyubPPl/8iW1nZCW', 'otrocliente', 'otrocliente', 'otrocliente@gmail.com', '549351221234', 2);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
