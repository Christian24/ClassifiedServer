/**
 * Created by Julian on 09.06.2016.
 */
/**
 * POSTGRESQL Connector.
 */
require("pg-pool");
var Pool = require("pg").Pool;
//var conString="postgres://rbmokhcvrfyiky:N8Zf-l_hee3NCA4mqjxeQGlZ9p@ec2-54-163-239-12.compute-1.amazonaws.com:5432/d253prihss1ba3";
var config = {
    user: "rbmokhcvrfyiky",
    password: "N8Zf-l_hee3NCA4mqjxeQGlZ9p",
    database: "d253prihss1ba3",
    port: 5432,
    host: "ec2-54-163-239-12.compute-1.amazonaws.com",
    ssl: true
};

var db = exports;
db.pool = function () {
    return new Pool(config);
};