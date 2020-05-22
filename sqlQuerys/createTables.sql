show databases;
create database delilah;
USE delilah;
CREATE TABLE usuarios(
	id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    usuario VARCHAR (60) UNIQUE NULL,
    nombre VARCHAR (60) NOT NULL,
    apellido VARCHAR (60) NOT NULL,
    mail VARCHAR (60) NOT NULL,
    tel VARCHAR (60) NOT NULL,
    direccionEnvio VARCHAR (60) NOT NULL,
    urlDireccionEnvio VARCHAR (120),
    hysPass VARCHAR (128) NOT NULL,
    salt VARCHAR(16) NOT NULL,
    activo BIT NOT NULL,
    administ BIT NOT NULL
);
CREATE TABLE estados(
	id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	estado VARCHAR(60)
);


CREATE TABLE productos (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(60) NOT NULL,
    descripcion VARCHAR(200) NOT NULL,
    precio DECIMAL(7 , 2 ) UNSIGNED NOT NULL,
    categoria VARCHAR(60),
    img_url VARCHAR(160),
    activo  BIT NOT NULL DEFAULT 1
);
CREATE TABLE formaPago(
	id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    descrip VARCHAR (60),
    alicuota DECIMAL(6,4) UNSIGNED NOT NULL
);

CREATE TABLE pedidos(
	id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    fechayhora DATETIME NOT NULL,
    idEstado INT NOT NULL,
    idFormaPago INT NOT NULL,
    idUsuario INT NOT NULL, 
	precioTotal DECIMAL(7,2) UNSIGNED,
    CONSTRAINT fk_pedidos_usuario_usuarioId
		FOREIGN KEY (idUsuario)
		REFERENCES usuarios (id),
	CONSTRAINT fk_pedidos_forma_pago
		FOREIGN KEY (idFormaPago)
		REFERENCES formaPago (id),
	CONSTRAINT fk_pedidos_estados
		FOREIGN KEY (idEstado)
		REFERENCES estados (id)
);

CREATE TABLE detalle_pedidos(
	id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    idPedido INT NOT NULL,
    idProducto INT NOT NULL,
    cantProductos INT NOT NULL,
    valorUnitario  DECIMAL(7 , 2 ) UNSIGNED NOT NULL,
    valorTotal DECIMAL(7,2) UNSIGNED NOT NULL,
	CONSTRAINT fk_detalle_pedidos_pedidos_id
		FOREIGN KEY (idPedido)
		REFERENCES pedidos (id),
	CONSTRAINT fk_detalle_pedidos_producto_id
		FOREIGN KEY (idProducto)
		REFERENCES productos (id)
);
