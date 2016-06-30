/**
 * Created by Julian on 20.05.2016.
 */

var logger= require("./logger.js");
var getPubkey = require("./getPubkey");
var db = require("./db.js");
var client = db.pool();
var base64 = require("./base64");
module.exports = function (request, response) {
    logger.info("---------------------------------------------------");
    logger.info("User is requesting a pubkey...");
    var user = base64.decode(request.params.user);
    if(user) {
        logger.info("---------------------------------------------------");
        logger.info("Retreiving pubkey...");
       getPubkey(user,function (error, result) {
           if(error) {
                logger.info("---------------------------------------------------");
                logger.info("Following error occured while searching pubkey for user " + user);
                logger.info(error);
                response.status(400).end("Sorry");
            }else {
               logger.info("---------------------------------------------------");
                if(result) {
                    logger.info("Successfully handed out pubkey...");
                    response.status(200).send(JSON.stringify(result)).end();
                } else {
                    logger.info("No pubkey for user " +user+ " was found.");
                    response.status(404).end("Sorry");
                }
            }
        })
    } else {
        logger.info("---------------------------------------------------");
        logger.info("Daten nicht vollständig");
        response.status(400).end("Sorry");
    }

};