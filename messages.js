/**
 * Created by Julian on 20.05.2016.
 */
const crypto = require("crypto");
const hash = crypto.createHash("sha256");
var db = require("./db.js");
var client = db.client();
var base64 = require("./base64.js");

module.exports = function (request, response) {

    var user = base64.decode(request.body.user);
    var timestamp = request.body.timestamp;
    var sig_utime = request.body.sig_utime;

    
    if(user && timestamp && sig_utime)
    {
        var sig_utime_check = hash.update(user.toString()+timestamp.toString());
        var date = new Date();
        if( (sig_utime == sig_utime_check) &&  !(new Date().now()/1000 < timestamp-(5*60)))
        {
            var sql_get = "SELECT sender,cipher,iv,key_recipient_enc,sig_recipient from Messages WHERE recipient = $1 sort by timestamp asc limit 1";
            var sql_delete = "DELETE * from Messages where id = $1";
           client.query(sql_get,[user],function (error, result) {
                if(error) {
                    console.log(error);
                    response.status(500).end("Sorry");
                }else {
                    if(result) {
                        var msg_id = result.rows[0].id;
                        client.query(sql_delete,[msg_id]);
                        response.status(200).send(JSON.stringify(result.rows[0])).end();
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