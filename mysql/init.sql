CREATE DATABASE IF NOT EXISTS node_db;

USE node_db;

CREATE TABLE peoples(id int not null auto_increment, name varchar(255), primary key(id));