/**
 * Created by Julian on 20.05.2016.
 */
var db = require("./db.js");
var pool = db();
var base64 = require("./base64.js");
module.exports = function (request, response) {
    var user = base64.decode(request.user);
    if(user) { 
        var client = pool.connect(function(err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            var sql = "SELECT salt_masterkey, privkey_user_enc, pubkey_user from Users WHERE username = $1";
            var statement = client.query(sql, [user], function (error, result) {
                if (error) {
                    console.log(error);
                    client.release();
                    response.status(400).end("Sorry");
                } else {
                    if (result) {
                        console.log("User " + user + " successfully logged in.");
                        var result = JSON.stringify(result.rows[0]);
                        client.release();
                        response.status(200).send(result).end();
                    } else {
                        client.release();
                        response.status(404).end("Sorry");
                    }
                }
            });
        });
    } else {
        console.log("Daten nicht vollständig");
        response.status(400).end("Sorry");
    }
};