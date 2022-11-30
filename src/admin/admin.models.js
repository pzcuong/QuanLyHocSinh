const sql = require("mssql");
var fs = require('fs');
var json2html = require('json2html');

const { config } = require('dotenv');
require('dotenv').config();

const configAdmin = {
    user: process.env.user,
    password: process.env.password,
    server: process.env.server,
    database: process.env.database,
    port: 1433
}
