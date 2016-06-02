/**
 * Created by Christian on 02.06.2016.
 */
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./webwemser.db');
module.exports = function(user,callback) {
    var sql = "SELECT pubkey_user from Users WHERE user = ?";
    var statement = db.prepare(sql);
    statement.get([user], function (error, row) {
       callback(error,row);
    });
}