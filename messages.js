/**
 * Created by Julian on 20.05.2016.
 */
const crypto = require("crypto");
const hash = crypto.createHash("sha256");
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./webwemser.db');

module.exports = function (request, response) {

    var user = request.body.user;
    var timestamp = request.body.timestamp;
    var sig_utime = request.body.sig_utime;

    if(user && timestamp && sig_utime)
    {
        var sig_utime_check = hash.update(user.toString()+timestamp.toString());
        var date = new Date();
        if( (sig_utime == sig_utime_check) &&  (new Date().now()/1000 == timestamp))
        {
            var sql = "SELECT pubkey_user from Users WHERE user = ?";
            var statement = db.prepare(sql);
           // statement.get([user],function (error, row){}

        }else{
            response.status(400).end("Timestamp outdated or Signature not matching.")
        }

    }else{
        response.status(400).end("Provide missing information.")
    }






    response.end("Danke für deine Nachricht: " + request.body.title);

};