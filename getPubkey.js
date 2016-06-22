/**
 * Created by Christian on 02.06.2016.
 */
var db = require("./db.js");
var client = db();
module.exports = function(user,callback) {
    var sql = "SELECT pubkey_user from Users WHERE username = $1";
    var statement = client.query(sql,[user], function (error, result) {
        if(error){
            console.error(error);
        }else {
            if(result) {
                callback(error, result);
            }
        }
    });
};
