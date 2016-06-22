/**
 * Created by Christian on 02.06.2016.
 */
var db = require("./db.js");
var pool = db();
module.exports = function(user,callback) {
    pool.connect(function(err,client,done) {
        if(err){
            console.info("---------------------------------------------------");
            console.info(new Date().toUTCString());
            console.info("Database connection error while trying to hand out pubkey.");
            console.error(err);
            console.info("---------------------------------------------------");
            response.status(500).end("Internal Server Error");
        }else{
            var sql = "SELECT pubkey_user from Users WHERE username = $1";
            client.query(sql, [user], function (error, result) {
                done();
                if (error) {
                    console.error(error);
                } else {
                    if (result) {
                        callback(error, result);
                    }
                }
            });
        }
    })
};
