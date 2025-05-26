-- Active: 1686084594206@@127.0.0.1@3306@chat

#Se crea la base de datos

CREATE DATABASE IF NOT EXISTS chat;

USE chat
#Estructura de para la tabla de roles

CREATE TABLE
    roles (
        id int NOT NULL,
        name VARCHAR(10),
        PRIMARY KEY(id)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

#Estructura de tabla para user

CREATE TABLE
    users (
        id VARCHAR(36) not NULL,
        firstName varchar(45) NOT NULL,
        lastName varchar(45) DEFAULT NULL,
        active tinyint(1) NOT NULL DEFAULT 1,
        email varchar(150) NOT NULL,
        password varchar(150) NOT NULL,
        img varchar(150) NOT NULL,
        roleId int NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (roleId) REFERENCES roles(id)
    );

#Se crea tabla de messages

CREATE TABLE messages (
    id VARCHAR(36) NOT NULL,
    content VARCHAR(255) NOT NULL,
    date TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    idEmitor VARCHAR(36) NOT NULL,
    idReceptor VARCHAR(36) NOT NULL,
    `read` BOOLEAN NOT NULL DEFAULT FALSE,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id),
    FOREIGN KEY (idEmitor) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (idReceptor) REFERENCES users(id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

INSERT INTO roles(id, name) VALUES(1, 'admin')

INSERT INTO roles(id, name) VALUES(2, 'user')