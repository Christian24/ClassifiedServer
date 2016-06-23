/**
 * Created by Christian on 02.06.2016.
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
