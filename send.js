/**
 * Created by Sergei on 27.05.2016.
 */
var getPubkey = require('./getPubkey.js');
var sigCreator = require("./sig_service");
var db = require("./db.js");
var pool = db.pool();
var base64 = require("./base64");
var logger= require("./logger.js");

module.exports = function (request, response) {

    logger.info("Follwing request is being processed:  (not decoded)");
    logger.info("User from request: " + request.params.user);
    logger.info("Timestamp from request: " + request.body.timestamp);
    logger.info("Recipient from request: " + request.body.recipient);
    logger.info("sig_service from request: " + request.body.sig_service);
    logger.info("Content of envelope: ");
    logger.info("envelope.cipher: " + request.body.envelope.cipher);
    logger.info("envelope.sender: " + request.body.envelope.sender);
    logger.info("envelope.iv: " + request.body.envelope.iv);
    logger.info("envelope.key_recipient_enc: " + request.body.envelope.key_recipient_enc);
    logger.info("envelope.sig_recipient: " + request.body.envelope.sig_recipient);
    /**
     * get parameters from request
     */
	var user = base64.decode(request.params.user);
    var timestamp = request.body.timestamp;
    var recipient = request.body.recipient;
    var sig_service = request.body.sig_service;
    var envelope = request.body.envelope;
    // test if every parameter for envelope is set
    var envelope_full = (envelope.cipher != null) && (envelope.sender != null) && (envelope.iv != null) && (envelope.key_recipient_enc != null) && (envelope.sig_recipient != null);
    logger.info("evelope full? : " + envelope_full);

	if((user != null) && (timestamp != null) && (recipient != null) && (sig_service != null) && (envelope_full == true)) {
		getPubkey(user,function(error, result) {
            if(error) {
                console.log(error);
                response.status(400).end("Sorry");
            }else {
                if(result) {
                    //We have a pubkey
                    var currentTime = Math.floor(Date.now() /1000);
                    var minTimestamp = Math.floor(minTimestamp - (5*60));
                    logger.info("Proceeding with check of timestamp...");
                    logger.info("Timestamp given:  " + timestamp);
                    logger.info("Timestamp server: " + currentTime);
                    //Check the time
                   if( (timestamp > minTimestamp) && (timestamp < currentTime)) {
                       logger.info("Timestamp from request is too old.");
                       response.status(400).end("Sorry, zu große Abweichung");
                   } else {
                       logger.info("Timestamp from request is ok.");
                       logger.info("Now starting to check sig_service.");
                    //Die Nachricht wurde zur richtigen Zeit gesendet.
                       //Authentifizierung
                       var newHash = sigCreator(envelope,timestamp,recipient,result.pubkey_user);
                       logger.info("Signature created by server: " + newHash.toString());
                       logger.info("Signature created by client: " + sig_service);
                       if(newHash == sig_service) {
                           logger.info("Signature sig_service has not been corrupted.");
                           pool.connect(function(err,client,done){
                               if(err){
                                   console.info("---------------------------------------------------");
                                   console.info(new Date().toUTCString());
                                   console.info("Database connection error while trying to receive messages sent by user '"+ user+ "'.");
                                   console.error(err);
                                   console.info("---------------------------------------------------");
                                   response.status(500).end("Internal Server Error");
                               }else{
                                   //Einsortieren
                                   var sql = "INSERT INTO MESSAGES(recipient, timestamp, sig_service,  sender, cipher, iv, key_recipient_enc, sig_recipient) VALUES($1,$2,$3,$4,$5,$6,$7,$8)";
                                   client.query(sql, [recipient, timestamp, sig_service, envelope.sender, envelope.cipher, envelope.iv, envelope.key_recipient_enc, envelope.sig_recipient], function (error) {
                                       if (error) {
                                           response.status(400).end("Sorry");
                                       } else {
                                           response.status(200).send(JSON.stringify(result.rows[0])).end();
                                       }
                                   });
                               }
                           });
                       } else {
                           response.status(400).end("Sorry");
                       }
                   }
                } else {
                    response.status(404).end("Sorry");
                }
            }
        });
	}
	response.status(400).end("Danke für deine Nachricht: " + request.body.user);
};
