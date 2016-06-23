/**
 * Created by Julian on 20.05.2016.
 */

/**
 * Setup Winston logger to write into file.
 * @type {any|*}
 */
var winston = require('winston');
var logger = new(winston.Logger)({
    transports: [
        new(winston.transports.Console)(),
        new(winston.transports.File)({filename: '/var/log/logF.log'})
    ]
});
var getPubkey = require("./getPubkey");
var db = require("./db.js");
var client = db.pool();
var base64 = require("./base64");
module.exports = function (request, response) {
    var user = base64.decode(request.params.user);
    if(user) {
       getPubkey(user,function (error, result) {
            if(error) {
                logger.log(error);
                response.status(400).end("Sorry");
            }else {
                if(result) {
                    response.status(200).send(JSON.stringify(result.rows[0])).end();
                } else {
                    response.status(404).end("Sorry");
                }
            }
        })
    } else {
        logger.log("Daten nicht vollständig");
        response.status(400).end("Sorry");
    }

};