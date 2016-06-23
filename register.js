/**
 * Created by Julian on 20.05.2016.
 */
var logger= require("./logger.js");
var db = require("./db.js");
var pool = db.pool();
var base64 = require("./base64");

module.exports = function (request, response) {

    var user = base64.decode(request.params.user);
    var salt_masterkey = request.body.salt_masterkey;
    var pubkey_user = request.body.pubkey_user;
    var privkey_user_enc = request.body.privkey_user_enc;

    logger.log("---------------------------------------------------");
    logger.log(new Date().toUTCString());
    logger.log("Request body:");
    logger.log("User: " + request.params.user);
    logger.log("salt_masterkey: " + request.body.salt_masterkey);
    logger.log("pubkey_user: " + request.body.pubkey_user);
    logger.log("privkey_user_enc: " + request.body.privkey_user_enc);
    logger.log("---------------------------------------------------");
    
    if(user && salt_masterkey && pubkey_user && privkey_user_enc) {
        pool.connect(function(err,client,done){
            if(err){
                logger.log("---------------------------------------------------");
                logger.log(new Date().toUTCString());
                logger.log("Database connection error while trying to register new user '" + user + "'.");
                logger.log(err);
                logger.log("---------------------------------------------------");
                response.status(500).end("Internal Server Error");
            }else{
                client.query("Select username from Users where username = $1 ", [user], function (error, result) {
                    done();
                    if (error) {
                        logger.log("---------------------------------------------------");
                        logger.log(new Date().toUTCString());
                        logger.log("Error while executing check for existing users. (register.js)");
                        logger.error(error);
                        logger.log("---------------------------------------------------");
                        response.status(500).end("Internal Server Error");
                    } else {
                        logger.log("This is the length: " + result.rows.length);
                        if (result.rows.length != 0) {
                            logger.log("---------------------------------------------------");
                            logger.log(new Date().toUTCString());
                            logger.log("A user with the name '" + user + "' already exists. (register.js)");
                            logger.log("---------------------------------------------------");
                            response.status(444).end("User already exists");

                        } else {
                            pool.connect(function(err,client,done){
                                if(err){
                                    logger.log("---------------------------------------------------");
                                    logger.log(new Date().toUTCString());
                                    logger.log("Database connection error while trying to register new user '" + user + "'.");
                                    logger.log(err);
                                    logger.log("---------------------------------------------------");
                                    response.status(500).end("Internal Server Error");
                                }else{
                                    client.query("INSERT INTO Users VALUES($1,$2,$3,$4)", [user, salt_masterkey, pubkey_user, privkey_user_enc], function (error) {
                                        done();
                                        if (error) {
                                            logger.log("---------------------------------------------------");
                                            logger.log(new Date().toUTCString());
                                            logger.log("Error while creating new user: " + user + ". (register.js)");
                                            logger.log(error);
                                            logger.log("---------------------------------------------------");
                                            response.status(400).end("Sorry this is shit");
                                        } else {
                                            logger.log("---------------------------------------------------");
                                            logger.log(new Date().toUTCString());
                                            logger.log("User " + user + " successfully created.");
                                            logger.log("---------------------------------------------------");
                                            response.status(200).end("User erfolgreich angelegt");
                                        }
                                    })
                                }
                            })

                        }
                    }
                })
            }
        })
    } else {
        response.status(400).end("Daten unvollständig.");
    }

};
