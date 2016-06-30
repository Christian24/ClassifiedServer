/**
 * Created by Julian on 20.05.2016.
 */
var logger= require("./logger.js");
const crypto = require("crypto");
var db = require("./db.js");
var pool = db.pool();
var sig_utimeCreator = require("./sig_utime.js");
var base64 = require("./base64.js");
var getPubkey = require('./getPubkey.js');
var urlencode = require("urlencode");

module.exports = function (request, response) {
    logger.info("---------------------------------------------------");
    logger.info("Requesting messages...");
    logger.info("The following request is being processed:  (not decoded)");
    logger.info("User retreiving messages: " + request.params.user);
    logger.info("Timestamp from request: " + request.query.timestamp);
    logger.info("Sig_utime from request: " + urlencode.decode(request.query.sig_utime));

    var user = base64.decode(request.params.user);
    var timestamp = request.query.timestamp;
    var sig_utime = urlencode.decode(request.query.sig_utime,"utf8");
    getPubkey(user,function(error, result) {
        if (error) {
            logger.info("---------------------------------------------------");
            logger.info("An error occured: ");
            logger.info(error);
            response.status(400).end("Sorry");
        } else {
            if (result) {
                //We have a pubkey
                var pubkey = result.pubkey_user;
                logger.info("---------------------------------------------------");
                logger.info("Pubkey retreived from database:" + pubkey);
                if(user && timestamp && sig_utime && pubkey)
                {
                    // Update Hash-Content with given username and timestamp
                    //var sig_utime_check = sig_utimeCreater(user,timestamp,pubkey);
                    logger.info("---------------------------------------------------");
                    logger.info("Verifying the sig_utime: ");
                    logger.info("sig_utime (Client): " + sig_utime);
                    var sig_utime_ok = sig_utimeCreator(user,timestamp,result.pubkey_user,sig_utime);
                    logger.info("Verification of sig_utime returned: " + sig_utime_ok);

                    var date = new Date();
                    // If the two Hashes match the request is ok.
                    if( (sig_utime_ok) &&  !(((Date.now())/1000) < timestamp-(5*60)))
                    {
                        logger.info("---------------------------------------------------");
                        logger.info("User has successfully been authorized and the timestamp is ok.");
                        var sql_get = "SELECT id, sender,cipher,iv,key_recipient_enc,sig_recipient from Messages WHERE recipient = $1 order by timestamp asc limit 1";
                        pool.connect(function(err,client,done){
                            logger.info("---------------------------------------------------");
                            logger.info("Trying to connect to database...");
                            if(err){
                                logger.info("---------------------------------------------------");
                                logger.info(Date.toUTCString());
                                logger.info("Database connection error while trying to deliver messages.");
                                logger.info(err);
                                logger.info("---------------------------------------------------");
                                response.status(500).end("Internal Server Error");
                            }else{
                                logger.info("---------------------------------------------------");
                                logger.info("Successfully connected to database...");
                                client.query(sql_get,[user],function (error, result) {
                                    done();
                                    logger.info("Trying to get information from Database...");
                                    if(error) {
                                        logger.info("---------------------------------------------------");
                                        logger.info("Query on database failed with following error: ");
                                        logger.info(error);
                                        response.status(500).end("Sorry");
                                    }else {
                                        logger.info("---------------------------------------------------");
                                        logger.info("Query on database succeeded...");
                                        logger.info("Checking if more messages are available...");
                                        if(result && (result.rows.length > 0)) {
                                            logger.info("---------------------------------------------------");
                                            logger.info("There are more messages available for user: "+user);
                                            logger.info("Query returned following result: ");
                                            logger.info("msg_id: " + result.rows[0].id);
                                            logger.info(result.rows[0]);
                                            var msg_id = result.rows[0].id;
                                            response.status(200).send(JSON.stringify(result.rows[0])).end();
                                            logger.info("Successfully delivered message Nr."+msg_id+" for User '"+result.rows[0].recipient+"'.");
                                            logger.info("Deleting delivered message with ID: " + msg_id);
                                            var sql_delete = "DELETE from Messages where id = $1";
                                            client.query(sql_delete,[msg_id], function(err){
                                              if(err){
                                                  logger.info("---------------------------------------------------");
                                                  logger.info("An error occured while deleting Message with ID: " + msg_id);
                                              }
                                            })
                                        } else {
                                            logger.info("---------------------------------------------------");
                                            logger.info("No more messages found for user '"+user+"'.");
                                            response.status(404).end("Nor more messages.");
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
                response.status(400).end("No such user found. Please register first.");
            }
        }
    });
};