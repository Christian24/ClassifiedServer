var crypto = require("crypto");
var logger= require("./logger.js");
var base64 = require("./base64.js");
/**
 * Created by Christian on 10.06.2016.
 * Creates a hash from envelope, timestamp, recipient and key
 */
var service = module.exports;

service.signature = function (string,key){//envelope,timestamp,recipient,key) {
    //var sign = crypto.createSign("RSA-SHA256");
    //sign.update(string);//update(envelope.user).update(envelope.cipher).update(envelope.iv).update(envelope.key_recipient_enc).update(envelope.sig_recipient).update(timestamp).update(recipient);
    //return sign.sign(key);



    var hash = crypto.createHash("sha256");
    hash.update(string);
    return hash.digest("base64");

};

service.verifySig = function(envelope, timestamp, recipient,key, sig_service){
    logger.info("--------------------------------------------")
    logger.info("decrypting sig_service with following parameters: ");
    logger.info("User: "+ envelope.sender);
    logger.info("Cipher: " + envelope.cipher);
    logger.info("IV: " + envelope.iv);
    logger.info("Key_recipient: " + envelope.key_recipient_enc);
    logger.info("Sig_recipient: " + envelope.sig_recipient);
    logger.info("Timestamp: " + timestamp);
    logger.info("Recipient: " + recipient);
    logger.info("Sig_service: " + sig_service);


    var sig = sig_service;
    var pubkey = key;

    var verify = crypto.createVerify('RSA-SHA256');
    verify.update(envelope.sender+envelope.cipher+envelope.iv+envelope.key_recipient_enc+envelope.sig_recipient+timestamp+recipient);
    return verify.verify(pubkey, new Buffer(sig, 'base64'));
};