/**
 * Created by Christian on 02.06.2016.
 */
var db = require("./db.js");
var client = db.client();
module.exports = function(user,callback) {
    var sql = "SELECT pubkey_user from Users WHERE user = ?";
    var statement = client.query(sql);
    statement.get([user], function (error, row) {
       callback(error,row);
    });
}