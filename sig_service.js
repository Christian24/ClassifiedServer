var crypto = require("crypto");
var logger= require("./logger.js");
var base64 = require("./base64.js");
/**
 * Created by Christian on 10.06.2016.
 * Creates a hash from envelope, timestamp, recipient and key
 */
var service = module.exports;

service.verifySig = function(envelope, timestamp, recipient,key, sig_service){
    logger.info("---------------------------------------------------");
    logger.info("Verifying signature sig_service...");

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