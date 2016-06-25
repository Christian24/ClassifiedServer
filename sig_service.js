var crypto = require("crypto");
var logger= require("./logger.js");
/**
 * Created by Christian on 10.06.2016.
 * Creates a hash from envelope, timestamp, recipient and key
 */
module.exports = function (envelope,timestamp,recipient,key) {
    return crypto.createHash("sha256",key).update(envelope.sender).update(envelope.cipher).update(envelope.iv).update(envelope.key_recipient_enc).update(envelope.sig_recipient).update(timestamp).update(recipient).digest("base64");
};