const express = require('express');
const routes = express.Router();
const faker = require('faker');
faker.locale = 'pt_BR';

const connection = require('./connectionDb');

routes.get('/', (_, res) => {
    const sql = `INSERT INTO peoples(name) VALUES('${faker.name.findName()}')`;
    connection.query(sql);

    connection.query("SELECT * FROM peoples", (_, results) => {
        let html = '<h1>Desafio Devops!</h1>';

        results.forEach(element => {
            html += element.name + '<br>'
        })

        return res.send(html);
    });
})

module.exports = routes;