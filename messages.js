/**
 * Created by Julian on 20.05.2016.
 */
var logger= require("./logger.js");
const crypto = require("crypto");
var db = require("./db.js");
var pool = db.pool();
var sig_utimeCreater = require("./sig_utime.js");
var base64 = require("./base64.js");
var getPubkey = require('./getPubkey.js');

module.exports = function (request, response) {
    logger.info("The following request is being processed:  (not decoded)");
    logger.info("User retreiving messages: " + request.params.user);
    logger.info("Timestamp from request: " + request.query.timestamp);
    logger.info("Sig_utime from request: " + request.query.sig_utime);

    var user = base64.decode(request.params.user);
    var timestamp = base64.decode(request.query.timestamp);
    var sig_utime = base64.decode(request.query.sig_utime);
    getPubkey(user,function(error, result) {
        if (error) {
            logger.log(error);
            response.status(400).end("Sorry");
        } else {
            if (result) {
                //We have a pubkey
                var pubkey = result;
                logger.info("Pubkey retreived from database:" + pubkey);
                if(user && timestamp && sig_utime && pubkey)
                {
                    // Update Hash-Content with given username and timestamp
                    var sig_utime_check = sig_utimeCreater(user,timestamp,pubkey);
                    var date = new Date();
                    // If the two Hashes match the request is ok.
                    if( (sig_utime == sig_utime_check) &&  !(new Date().now()/1000 < timestamp-(5*60)))
                    {
                        var sql_get = "SELECT sender,cipher,iv,key_recipient_enc,sig_recipient from Messages WHERE recipient = $1 sort by timestamp asc limit 1";
                        var sql_delete = "DELETE * from Messages where id = $1";
                        pool.connect(function(err,client,done){
                            if(err){
                                logger.info("---------------------------------------------------");
                                logger.info(new Date().toUTCString());
                                logger.info("Database connection error while trying to deliver messages.");
                                logger.error(err);
                                logger.info("---------------------------------------------------");
                                response.status(500).end("Internal Server Error");
                            }else{
                                client.query(sql_get,[user],function (error, result) {
                                    done();
                                    if(error) {
                                        logger.log(error);
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
                            }
                        });
                    }else{
                        response.status(400).end("Timestamp outdated or Signature not matching.")
                    }
                }else{
                    response.status(400).end("Provide missing information.")
                }
            }else{
                response.status(404).end("No such user found. Please register first.");
            }
        }
    });
};