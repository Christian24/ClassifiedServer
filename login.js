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
var db = require("./db.js");
var pool = db.pool();
var base64 = require("./base64.js");
module.exports = function (request, response) {
    var user = base64.decode(request.params.user);
    logger.info("User "+ user +" trying to login.");
    if(user) {
        logger.info("logging in user "+user+".");
        pool.connect(function(err,client,done){
            if(err){
                logger.info("---------------------------------------------------");
                logger.info(new Date().toUTCString());
                logger.info("Database connection error while trying to login new user '"+ user+ "'.");
                logger.error(err);
                logger.info("---------------------------------------------------");
                response.status(500).end("Internal Server Error");
            }else {
                logger.log("searching for userdata");
                client.query("SELECT salt_masterkey, privkey_user_enc, pubkey_user from Users WHERE username = $1",[user],function (error, result) {
                    done();
                    if (error) {
                        logger.log("Error handled.");
                        logger.log(error);
                        response.status(400).end("Sorry");
                    } else {
                        logger.log("No error occured.");
                        if (result) {
                            logger.info("The Result:");
                            logger.info("User " + user + " successfully logged in.");
                            response.status(200).send(JSON.stringify(result.rows[0])).end();
                        } else {
                            response.status(404).end("Sorry");
                        }
                    }
                });
            }
        });
    } else {
        logger.info("Daten nicht vollständig");
        response.status(400).end("Sorry");
    }
};