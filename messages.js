/**
 * Created by Julian on 20.05.2016.
 */
const crypto = require("crypto");
//Create empty SHA256 Hash
const hash = crypto.createHash("sha256");
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./webwemser.db');

module.exports = function (request, response) {

    var user = request.body.user;
    var timestamp = request.body.timestamp;
    var sig_utime = request.body.sig_utime;

    
    if(user && timestamp && sig_utime)
    {
        // Update Hash-Content with given username and timestamp
        var sig_utime_check = hash.update(user.toString()+timestamp.toString());
        var date = new Date();
        // If the two Hashes match the request is ok.
        if( (sig_utime == sig_utime_check) &&  !(new Date().now()/1000 < timestamp-(5*60)))
        {
            //SQL-Query to get the oldest unread message
            var sql_get = "SELECT sender,cipher,iv,key_recipient_enc,sig_recipient from Messages WHERE recipient = ? sort by timestamp asc limit 1";
            //Query to delete the oldest unread message
            var sql_delete = "DELETE * from Messages where id = ?";
            var statement = db.prepare(sql_get);
            // Call statement with user as parameter
            statement.get([user],function (error, row) {
                if(error) {
                    console.log(error);
                    response.status(500).end("Sorry");
                }else {
                    if(row) {
                        // delete the message we got from the database and send the results from the query to the application.
                        var msg_id = row.id;
                        db.run(sql_delete,[msg_id]);
                        response.status(200).send(JSON.stringify(row)).end();
                    } else {
                        response.status(404).end("Sorry");
                    }
                }
            });

        }else{
            response.status(400).end("Timestamp outdated or Signature not matching.")
        }

    }else{
        response.status(400).end("Provide missing information.")
    }

};