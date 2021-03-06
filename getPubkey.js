/**
 * Created by Julian, Christian on 02.06.2016.
 */
var logger= require("./logger.js");
var db = require("./db.js");
var pool = db.pool();
module.exports = function(user,callback) {
    logger.info("---------------------------------------------------");
    logger.info("Pubkey requested...");
    pool.connect(function(err,client,done) {
        if(err){
            logger.info(new Date().toUTCString());
            logger.info("---------------------------------------------------");
            logger.info("Database connection error while trying to hand out pubkey.");
            logger.error(err);
            logger.info("---------------------------------------------------");
            response.status(500).end("Internal Server Error");
        }else{
            var sql = "SELECT pubkey_user from Users WHERE username = $1";
            client.query(sql, [user], function (error, result) {
                done();
                if (error) {
                    logger.error(error);
                } else
                    logger.info("---------------------------------------------------");
                    logger.info("Pubkeys found: " + result.rows.length + " (should be 1)");
                    if (result && result.rows.length > 0) {
                        logger.info("---------------------------------------------------");
                        logger.info("Public key for user " + user + " found: " + result.rows[0].pubkey_user);
                        callback(error, result.rows[0]);
                    }else{
                        logger.info("---------------------------------------------------");
                        logger.info("No public key for user "+ user + " found.");
                        callback(error);
                    }
                }
            });
        }
    })
};
