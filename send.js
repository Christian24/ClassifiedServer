/**
 * Created by Sergei on 27.05.2016.
 */
var getPubkey = require('./getPubkey.js');
var sigCreater = require("./sig_service");
var db = require("./db.js");
var client = db();
var base64 = require("./base64");

module.exports = function (request, response) {
    /**
     * get parameters from request
     */
	var user = base64.decode(request.body.user);
    var timestamp = request.params.timestamp;
    var recipient = request.params.recipient;
    var sig_service = request.params.sig_service;
    var envelope = request.params.envelope;
    // test if every parameter for envelope is set
    var envelope_full = envelope.cipher && envelope.sender && envelope.iv && envelope.key_recipient_enc && envelope.sig_recipient;


	if(user && timestamp && recipient && sig_service && envelope_full) {
		getPubkey(user,function(error, result) {
            if(error) {
                console.log(error);
                response.status(400).end("Sorry");
            }else {
                if(result) {
                    //We have a pubkey
                     var currentTime = Date.now() /1000;
                    //Check the time
                   if(  timestamp > (currentTime -5*60 ) && timestamp < currentTime) {
                       reponse.status(400).end("Sorry, zu große Abweichung");
                   } else {
                    //Die Nachricht wurde zur richtigen Zeit gesendet.
                       //Authentifizierung


                        var newHash = sigCreater(envelope,timestamp,recipient,result);
                       if(newHash == sig_service) {
                           //Einsortieren
                           var sql = "INSERT INTO MESSAGES(recipient, timestamp, sig_service,  sender, cipher, iv, key_recipient_enc, sig_recipient, read) VALUES(?,?,?,?,?,?,?,?,0)";
                           client.query(sql, [recipient, timestamp, sig_service, envelope.sender, envelope.cipher, envelope.iv, envelope.key_recipient_enc, envelope.sig_recipient], function (error) {
                               if (error) {
                                   response.status(400).end("Sorry");
                               } else {
                                   response.status(200).send(JSON.stringify(result.rows[0])).end();
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
    
	response.end("Danke für deine Nachricht: " + request.body.title);
};
