/**
 * Created by Julian on 20.05.2016.
 */
var logger= require("./logger.js");
var db = require("./db.js");
var pool = db.pool();
var base64 = require("./base64");

module.exports = function (request, response) {
    logger.info("---------------------------------------------------");
    logger.info("Registering a user...");
    var user = base64.decode(request.params.user);
    var salt_masterkey = request.body.salt_masterkey;
    var pubkey_user = request.body.pubkey_user;
    var privkey_user_enc = request.body.privkey_user_enc;

    logger.info("---------------------------------------------------");
    logger.info("Following data was send to the server: ");
    logger.info(new Date().toUTCString());
    logger.info("Request body:");
    logger.info("User: " + request.params.user);
    logger.info("salt_masterkey: " + request.body.salt_masterkey);
    logger.info("pubkey_user: " + request.body.pubkey_user);
    logger.info("privkey_user_enc: " + request.body.privkey_user_enc);
    
    if(user && salt_masterkey && pubkey_user && privkey_user_enc) {
        pool.connect(function(err,client,done){
            if(err){
                logger.info("---------------------------------------------------");
                logger.info(new Date().toUTCString());
                logger.info("Database connection error while trying to register new user '" + user + "'.");
                logger.info(err);
                response.status(500).end("Internal Server Error");
            }else{
                logger.info("---------------------------------------------------");
                logger.info("Searching for existing users in the database...");
                client.query("Select username from Users where username = $1 ", [user], function (error, result) {
                    done();
                    if (error) {
                        logger.info("---------------------------------------------------");
                        logger.info(new Date().toUTCString());
                        logger.info("Error while executing check for existing users. (register.js)");
                        logger.error(error);
                        response.status(500).end("Internal Server Error");
                    } else {
                        logger.info("---------------------------------------------------");
                        logger.info("This is the length: " + result.rows.length);
                        if (result.rows.length != 0) {
                            logger.info("---------------------------------------------------");
                            logger.info(new Date().toUTCString());
                            logger.info("A user with the name '" + user + "' already exists. (register.js)");
                            response.status(444).end("User already exists");
                        } else {
                            logger.info("---------------------------------------------------");
                            logger.info("No existing users were found. Registering can begin...");
                            pool.connect(function(err,client,done){
                                if(err){
                                    logger.info("---------------------------------------------------");
                                    logger.info(new Date().toUTCString());
                                    logger.info("Database connection error while trying to register new user '" + user + "'.");
                                    logger.info(err);
                                    response.status(500).end("Internal Server Error");
                                }else{
                                    logger.info("---------------------------------------------------");
                                    logger.info("Creating user (inserting in database) ... ");
                                    client.query("INSERT INTO Users VALUES($1,$2,$3,$4)", [user, salt_masterkey, pubkey_user, privkey_user_enc], function (error) {
                                        done();
                                        if (error) {
                                            logger.info("---------------------------------------------------");
                                            logger.info(new Date().toUTCString());
                                            logger.info("Error while creating new user: " + user + ". (register.js)");
                                            logger.info(error);
                                            response.status(400).end("Sorry this is shit");
                                        } else {
                                            logger.info("---------------------------------------------------");
                                            logger.info(new Date().toUTCString());
                                            logger.info("User " + user + " successfully created.");
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
        logger.info("---------------------------------------------------");
        logger.info("Daten unvollständing: 404 gesendet...");
        response.status(400).end("Daten unvollständig.");
    }

};
