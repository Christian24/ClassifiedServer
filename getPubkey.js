/**
 * Created by Christian on 02.06.2016.
 */
var db = require("./db.js");
var pool = db();
module.exports = function(user,callback) {
    var client = pool.connect(function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        var sql = "SELECT pubkey_user from Users WHERE username = $1";
        var statement = client.query(sql, [user], function (error, result) {
            if (error) {
                console.error(error);
                client.release();
            } else {
                if (result) {
                    client.release();
                    callback(error, result);
                }
            }
        });
    });
};
