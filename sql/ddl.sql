
CREATE DATABASE IF NOT EXISTS mini_olx CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE mini_olx;



CREATE TABLE usuario (
  id_usuario   INT AUTO_INCREMENT PRIMARY KEY,
  nome         VARCHAR(100) NOT NULL,
  email        VARCHAR(100) NOT NULL UNIQUE,
  senha        VARCHAR(255) NOT NULL
);


CREATE TABLE categoria (
  id_categoria INT AUTO_INCREMENT PRIMARY KEY,
  nome         VARCHAR(100) NOT NULL
);


INSERT INTO categoria (nome) VALUES
('Eletrônicos'), ('Roupas'), ('Móveis'), ('Games'), ('Esporte'), ('Automotivo');


CREATE TABLE produto (
  id_produto   INT AUTO_INCREMENT PRIMARY KEY,
  nome         VARCHAR(100) NOT NULL,
  descricao    TEXT,
  preco        DECIMAL(10,2) NOT NULL,
  status       ENUM('disponivel','vendido') DEFAULT 'disponivel',
  imagem       VARCHAR(255),
  id_categoria INT NOT NULL,
  id_vendedor  INT NOT NULL,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria),
  FOREIGN KEY (id_vendedor)  REFERENCES usuario(id_usuario)
);

CREATE TABLE proposta (
  id_proposta   INT AUTO_INCREMENT PRIMARY KEY,
  id_produto    INT NOT NULL,
  id_comprador  INT NOT NULL,
  valor_ofertado DECIMAL(10,2) NOT NULL,
  mensagem      TEXT,
  status        ENUM('pendente','aceita','recusada') DEFAULT 'pendente',
  data_envio    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_produto)   REFERENCES produto(id_produto),
  FOREIGN KEY (id_comprador) REFERENCES usuario(id_usuario)
);


DELIMITER $$

DROP TRIGGER IF EXISTS trg_usuario_bi $$
CREATE TRIGGER trg_usuario_bi
BEFORE INSERT ON usuario
FOR EACH ROW
BEGIN
  SET NEW.senha = MD5(NEW.senha);
END $$

DROP TRIGGER IF EXISTS trg_usuario_bu $$
CREATE TRIGGER trg_usuario_bu
BEFORE UPDATE ON usuario
FOR EACH ROW
BEGIN
  IF NEW.senha <> OLD.senha THEN
    SET NEW.senha = MD5(NEW.senha);
  END IF;
END $$

DELIMITER ;

