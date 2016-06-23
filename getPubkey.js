/**
 * Created by Christian on 02.06.2016.
 */
var logger= require("./logger.js");
var db = require("./db.js");
var pool = db.pool();
module.exports = function(user,callback) {
    pool.connect(function(err,client,done) {
        if(err){
            logger.info("---------------------------------------------------");
            logger.info(new Date().toUTCString());
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
                } else {
                    if (result) {
                        callback(error, result);
                    }
                }
            });
        }
    })
};
